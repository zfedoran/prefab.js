define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'graphics/meshFactory',
        'graphics/mesh',
        'components/quad'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller,
        MeshFactory,
        Mesh,
        Quad
    ) {
        'use strict';

        /**
        *   This class updates the mesh associated with entities which have a
        *   Quad component.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var QuadController = function(context) {
            Controller.call(this, context);

            this.meshFactory = new MeshFactory(this.device);
        };

        QuadController.prototype = _.create(Controller.prototype, {
            constructor: QuadController,

            /**
            *   Update all entities which contain the Quad and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'Quad', 'MeshFilter'], function(entity) {
                    var transform  = entity.getComponent('Transform');
                    var quad       = entity.getComponent('Quad');

                    if (quad.isDirty()) {
                        var meshFilter = entity.getComponent('MeshFilter');
                        var mesh       = meshFilter.getMesh();

                        if (mesh) {
                            mesh.destroy();
                        } else {
                            mesh = new Mesh(this.device, Mesh.TRIANGLES);
                        }

                        this.generateQuadMesh(quad, mesh);
                        meshFilter.setMesh(mesh);

                        quad.setDirty(false);
                    }
                }, this);
            },

            /**
            *   Generate the 6 faces of a quad and return a mesh.
            *
            *   @method generateQuadMesh
            *   @param {quad}
            *   @returns {mesh}
            */
            generateQuadMesh: function(quad, mesh) {
                var w, h, hw, hh;

                w = quad.width;
                h = quad.height;

                hw = w / 2;
                hh = h / 2;

                this.meshFactory.begin(mesh);
                
                if (quad.mode === Quad.MODE_SLICED) {
                    this.generateSlicedFace(hw, hh, quad);
                } else {
                    this.generateFace(hw, hh, quad);
                }

                this.meshFactory.end();

                return mesh;
            },

            /**
            *   Generate the quad face.
            *
            *   @method generateFace
            *   @param {w} width
            *   @param {h} height
            *   @param {quad} quad
            *   @returns {undefined}
            */
            generateFace: function(w, h, quad) {
                var sprite = quad.sprite;
                var anchor = quad.anchor;

                // set the internal width and height values (in this case they should not differ)
                quad._width  = w * 2;
                quad._height = h * 2;

                var vertexCount = this.meshFactory.getVertexCount();

                if (sprite) {
                    var u, v, s, t;
                    u = sprite.getUCoordinate();
                    v = sprite.getVCoordinate();
                    s = sprite.getUVWidth();
                    t = sprite.getUVHeight();

                    this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                    this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                    this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                    this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                }

                var ax, ay, az;
                ax = anchor.x * w;
                ay = anchor.y * h;
                az = anchor.z;

                this.meshFactory.addVertex(new Vector3(-w + ax, -h + ay, az));
                this.meshFactory.addVertex(new Vector3(-w + ax,  h + ay, az));
                this.meshFactory.addVertex(new Vector3( w + ax,  h + ay, az));
                this.meshFactory.addVertex(new Vector3( w + ax, -h + ay, az));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            },

            /**
            *   Generate the sliced quad face.
            *
            *   @method generateSlicedFace
            *   @param {w} width
            *   @param {h} height
            *   @param {quad} 
            *   @returns {undefined}
            */
            generateSlicedFace: function(w, h, quad) {
                var sprite = quad.sprite;
                var anchor = quad.anchor;

                if (!sprite) {
                    throw 'QuadController: cannot create a sliced Quad without a sprite.';
                }

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth() / 3;
                t = sprite.getUVHeight() / 3;

                // corner width and heights
                var cw = sprite.width / 3;
                var ch = sprite.height / 3;

                // edge width and hights
                var ew = Math.max(2 * (w - cw), 0);
                var eh = Math.max(2 * (h - ch), 0);

                // recalculate width and height in case ew/eh are less than 0 above
                w = (cw * 2 + ew) * 0.5;
                h = (ch * 2 + eh) * 0.5;

                // set the internal width and height values
                quad._width  = w * 2;
                quad._height = h * 2;

                var ax, ay, az;
                ax = anchor.x * w;
                ay = anchor.y * h;
                az = anchor.z;

                /*
                *    1---2------3---4
                *    | / |  /   | / |
                *    5---6------7---8
                *    | / |    / | / |
                *    |   |  /   |   |
                *    9--10-----11--12
                *    | / |  /   | / |
                *    13-14-----15--16
                */

                var vertexCount = this.meshFactory.getVertexCount() - 1;

                this.meshFactory.addVertex(new Vector3(-w + ax,      h + ay, az)); // 1
                this.meshFactory.addVertex(new Vector3(-w + ax + cw, h + ay, az)); // 2
                this.meshFactory.addVertex(new Vector3( w + ax - cw, h + ay, az)); // 3
                this.meshFactory.addVertex(new Vector3( w + ax,      h + ay, az)); // 4

                this.meshFactory.addVertex(new Vector3(-w + ax,      h + ay - ch, az)); // 5
                this.meshFactory.addVertex(new Vector3(-w + ax + cw, h + ay - ch, az)); // 6
                this.meshFactory.addVertex(new Vector3( w + ax - cw, h + ay - ch, az)); // 7
                this.meshFactory.addVertex(new Vector3( w + ax,      h + ay - ch, az)); // 8

                this.meshFactory.addVertex(new Vector3(-w + ax,      -h + ay + ch, az)); // 9
                this.meshFactory.addVertex(new Vector3(-w + ax + cw, -h + ay + ch, az)); // 10
                this.meshFactory.addVertex(new Vector3( w + ax - cw, -h + ay + ch, az)); // 11
                this.meshFactory.addVertex(new Vector3( w + ax,      -h + ay + ch, az)); // 12

                this.meshFactory.addVertex(new Vector3(-w + ax,      -h + ay, az)); // 13
                this.meshFactory.addVertex(new Vector3(-w + ax + cw, -h + ay, az)); // 14
                this.meshFactory.addVertex(new Vector3( w + ax - cw, -h + ay, az)); // 15
                this.meshFactory.addVertex(new Vector3( w + ax,      -h + ay, az)); // 16

                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 0, v + t * 0)); // 1
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 1, v + t * 0)); // 2
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 2, v + t * 0)); // 3
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 3, v + t * 0)); // 4

                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 0, v + t * 1)); // 5
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 1, v + t * 1)); // 6
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 2, v + t * 1)); // 7
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 3, v + t * 1)); // 8

                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 0, v + t * 2)); // 9
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 1, v + t * 2)); // 10
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 2, v + t * 2)); // 11
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 3, v + t * 2)); // 12

                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 0, v + t * 3)); // 9
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 1, v + t * 3)); // 10
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 2, v + t * 3)); // 11
                this.meshFactory.addUVtoLayer0(new Vector2(u + s * 3, v + t * 3)); // 12

                // top row
                this.meshFactory.addTriangle(vertexCount + 5, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount + 5, vertexCount + 2, vertexCount + 6);

                this.meshFactory.addTriangle(vertexCount + 6, vertexCount + 2, vertexCount + 3);
                this.meshFactory.addTriangle(vertexCount + 6, vertexCount + 3, vertexCount + 7);

                this.meshFactory.addTriangle(vertexCount + 7, vertexCount + 3, vertexCount + 4);
                this.meshFactory.addTriangle(vertexCount + 7, vertexCount + 4, vertexCount + 8);

                // center row
                this.meshFactory.addTriangle(vertexCount + 9, vertexCount + 5, vertexCount + 6);
                this.meshFactory.addTriangle(vertexCount + 9, vertexCount + 6, vertexCount + 10);

                this.meshFactory.addTriangle(vertexCount + 10, vertexCount + 6, vertexCount + 7);
                this.meshFactory.addTriangle(vertexCount + 10, vertexCount + 7, vertexCount + 11);

                this.meshFactory.addTriangle(vertexCount + 11, vertexCount + 7, vertexCount + 8);
                this.meshFactory.addTriangle(vertexCount + 11, vertexCount + 8, vertexCount + 12);

                // bottom row
                this.meshFactory.addTriangle(vertexCount + 13, vertexCount + 9, vertexCount + 10);
                this.meshFactory.addTriangle(vertexCount + 13, vertexCount + 10, vertexCount + 14);

                this.meshFactory.addTriangle(vertexCount + 14, vertexCount + 10, vertexCount + 11);
                this.meshFactory.addTriangle(vertexCount + 14, vertexCount + 11, vertexCount + 15);

                this.meshFactory.addTriangle(vertexCount + 15, vertexCount + 11, vertexCount + 12);
                this.meshFactory.addTriangle(vertexCount + 15, vertexCount + 12, vertexCount + 16);
            }
        });

        return QuadController;
    }
);
