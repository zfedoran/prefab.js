define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'math/plane',
        'core/controller',
        'graphics/mesh'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Plane,
        Controller,
        Mesh
    ) {
        'use strict';

        var ClipController = function(context) {
            Controller.call(this, context);

        };

        ClipController.prototype = _.create(Controller.prototype, {
            constructor: ClipController,

            /**
            *   Update all entities which contain the MeshClip and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'MeshClip'], function(entity) {
                    var transform = entity.getComponent('Transform');
                    var meshClip  = entity.getComponent('MeshClip');

                    if (meshClip.isDirty()) {
                        this.clipEntity(entity, meshClip);

                        meshClip.setDirty(false);
                    }
                }, this);
            },

            /**
            *   This recursive function will clip all child entities that have
            *   a MeshFilter component.
            *
            *   @method clipEntity
            *   @param {entity}
            *   @returns {undefined}
            */
            clipEntity: function(entity, meshClip) {
                if (entity.hasComponent('MeshFilter')) {
                    this.generateClippedMesh(entity, meshClip);
                }

                // Clip any child entities
                if (entity.hasChildren()) {
                    for (var i = 0; i < entity.children.length; i++) {
                        this.clipEntity(entity.children[i], meshClip);
                    }
                }
            },

            /**
            *   This method generates a list of polygons given a mesh.
            *
            *   @method generatePolygonList
            *   @param {mesh}
            *   @returns {undefined}
            */
            generatePolygonList: function(mesh) {
                var polygonList = [];

                var i, j, stride = mesh.vertexDeclaration.stride;

                // For each triangle
                var ai, bi, ci, av, bv, cv;
                for (i = 0; i < mesh.indexData.length; i+=3) {
                    ai = mesh.indexData[i+0];
                    bi = mesh.indexData[i+1];
                    ci = mesh.indexData[i+2];

                    av = []; bv = []; cv = [];
                    for (j = 0; j < stride; j++) {
                        av.push(mesh.vertexData[ai*stride + j]);
                        bv.push(mesh.vertexData[bi*stride + j]);
                        cv.push(mesh.vertexData[ci*stride + j]);
                    }

                    polygonList.push([av, bv, cv]); 
                }

                return polygonList;
            },

            /**
            *   This method generates a list of planes for a given MeshClip
            *   component.
            *
            *   @method generatePlaneList
            *   @param {meshClip}
            *   @returns {undefined}
            */
            generatePlaneList: function(meshClip, entity) {
                var boundingBox = meshClip.boundingBox;

                var planeList = [
                    Plane.createFromPoint(boundingBox.min, new Vector3(-1, 0, 0)),
                    Plane.createFromPoint(boundingBox.max, new Vector3( 1, 0, 0)),
                    Plane.createFromPoint(boundingBox.min, new Vector3(0, -1, 0)),
                    Plane.createFromPoint(boundingBox.max, new Vector3(0,  1, 0)),
                    Plane.createFromPoint(boundingBox.min, new Vector3(0, 0, -1)),
                    Plane.createFromPoint(boundingBox.max, new Vector3(0, 0,  1))
                ];

                var invWorldMatrix = entity.getComponent('Transform').getWorldMatrix().clone();
                invWorldMatrix.inverse();

                planeList[0].transform(invWorldMatrix);
                planeList[1].transform(invWorldMatrix);
                planeList[2].transform(invWorldMatrix);
                planeList[3].transform(invWorldMatrix);
                planeList[4].transform(invWorldMatrix);
                planeList[5].transform(invWorldMatrix);

                return planeList;
            },

            /**
            *   This method clips the given convex polygon to the provided
            *   plane.
            *
            *   @method clipPolygonToPlane
            *   @param {polygon}
            *   @param {plane}
            *   @returns {undefined}
            */
            clipPolygonToPlane: function(polygon, plane) {
                var result = [];

                if (polygon.length > 0) {
                    var index, q, p, av, bv;
                    for (index = 0; index < polygon.length-1; index++) {
                        av = polygon[index+0];
                        bv = polygon[index+1];

                        this.clipSegmentToPlane(av, bv, plane, result);
                    }

                    // The pair made from the first and last vertex
                    this.clipSegmentToPlane(polygon[index], polygon[0], plane, result);
                }

                return result;
            },

            /**
            *   This method clips the given line segment to the provided plane.
            *   (Note: If there is no intersection, only the first vertex is added)
            *
            *   @method clipSegmentToPlane
            *   @param {function}
            *   @returns {undefined}
            */
            clipSegmentToPlane: (function() {
                var a   = new Vector3();
                var b   = new Vector3();
                var tmp = new Vector3();

                return function(av, bv, plane, result) {
                    if (typeof result === 'undefined') {
                        result = [];
                    }

                    // TODO: use the vertex declaration here
                    a.set(av[0], av[1], av[2]);
                    b.set(bv[0], bv[1], bv[2]);

                    var p = Vector3.multiplyScalar(plane.normal, plane.distance);

                    // Check if point A is on the positive or negative clipping side of the plane
                    Vector3.subtract(a, p, /*out*/ tmp);
                    var shouldClipPointA = Vector3.dot(plane.normal, tmp) > 0;

                    // If A should not be clipped, add it to the result array
                    if (!shouldClipPointA) {
                        result.push(av);
                    }

                    // If the AB segment intersects the plane
                    var t = plane.intersectSegment(a, b);
                    if (t > 0 && t < 1) {
                        var qv = [];
                        var dataIndex, dataValue, dataLength = av.length;

                        // Lerp each vertex data value using t
                        for (dataIndex = 0; dataIndex < dataLength; dataIndex++) {
                            dataValue = av[dataIndex] + (t * (bv[dataIndex] - av[dataIndex]));
                            qv.push(dataValue);
                        }

                        result.push(qv);
                    }

                    return result;
                };
            })(),

            /**
            *   This method generates a mesh from a list of convex polygons.
            *
            *   @method generateMesh
            *   @param {polygonList}
            *   @returns {undefined}
            */
            generateMesh: function(polygonList) {
                var vertexData = [];
                var indexData  = [];

                var currentIndex = 0;

                var polyIndex, polygon;
                for (polyIndex = 0; polyIndex < polygonList.length; polyIndex++) {
                    polygon = polygonList[polyIndex];

                    if (polygon.length > 2) {

                        var vertIndex, vertex;
                        for (vertIndex = 1; vertIndex < polygon.length - 1; vertIndex++) {
                            indexData.push(currentIndex);
                            indexData.push(currentIndex + vertIndex);
                            indexData.push(currentIndex + vertIndex + 1);
                        }

                        for (vertIndex = 0; vertIndex < polygon.length; vertIndex++) {
                            vertex = polygon[vertIndex];

                            var dataIndex, dataValue, dataLength = vertex.length;
                            for (dataIndex = 0; dataIndex < dataLength; dataIndex++) {
                                dataValue = vertex[dataIndex];
                                vertexData.push(dataValue);
                            }

                            currentIndex++;
                        }
                    }
                }

                var typedIndexData  = new Uint16Array(indexData);
                var typedVertexData = new Float32Array(vertexData);

                var mesh = new Mesh(this.device, Mesh.TRIANGLES);

                mesh.setIndexData(typedIndexData);
                mesh.setVertexData(typedVertexData);

                // Remind the developer and hint to the VM that these are not used anymore
                indexData.length  = 0;
                vertexData.length = 0;

                return mesh;
            },

            /**
            *   This function generates a new mesh for the MeshFilter
            *   component, clipped by the MeshClip component.
            *
            *   @method generateClippedMesh
            *   @param {entity}
            *   @param {meshFilter}
            *   @returns {undefined}
            */
            generateClippedMesh: function(entity, meshClip) {
                var meshFilter = entity.getComponent('MeshFilter');

                // TODO: support clipping a clipped mesh (for when multiple entities are clipping a sub entity)
                //       (this would require setting original mesh to be the clipped mesh, plus some extra magic)
                var originalMesh = meshFilter.getMesh();
                var clippedMesh  = meshFilter.getClippedMesh();

                if (clippedMesh) {
                    clippedMesh.destroy();
                } 

                // CLIPPING ALGORITHM
                // for each convex polygon
                //   for each clipping plane (6 sides of the bounding box)
                //       for each pair of vertices in polyIn (including the last-first pair)
                //         if v1 should NOT be clipped
                //            add it to polyOut
                //         if there is an intersection with the plane:
                //            add a vertex at the intersection point
                //     polyIn = polyOut 

                var polygonList = this.generatePolygonList(originalMesh);
                var planeList   = this.generatePlaneList(meshClip, entity);

                // For each convex polygon
                var polyIndex, polygon; 
                for (polyIndex = 0; polyIndex < polygonList.length; polyIndex++) {
                    polygon = polygonList[polyIndex];

                    // For each clipping plane
                    var planeIndex, plane;
                    for (planeIndex = 0; planeIndex < planeList.length; planeIndex++) {
                        plane = planeList[planeIndex];

                        // Create a new polygon
                        polygon = this.clipPolygonToPlane(polygon, plane);
                    }

                    // Save the polygon after it has been clipped against all planes
                    polygonList[polyIndex] = polygon;
                }
                
                clippedMesh = this.generateMesh(polygonList);
                clippedMesh.setVertexDeclaration(originalMesh.vertexDeclaration);
                clippedMesh.warm();

                meshFilter.setClippedMesh(clippedMesh);
            }
        });

        return ClipController;
    }
);
