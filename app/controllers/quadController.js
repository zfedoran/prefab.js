define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'graphics/meshFactory',
        'graphics/mesh'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller,
        MeshFactory,
        Mesh
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
                    var meshFilter = entity.getComponent('MeshFilter');

                    if (quad.isDirty()) {
                        if (meshFilter.mesh) {
                            meshFilter.mesh.destroy();
                        }

                        meshFilter.mesh = this.generateQuadMesh(quad);

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
            generateQuadMesh: function(quad) {
                var w, h, hw, hh;

                w = quad.width;
                h = quad.height;

                hw = w / 2;
                hh = h / 2;

                var mesh = new Mesh(this.device, Mesh.TRIANGLES);
                this.meshFactory.begin(mesh);

                this.generateFace(hw, hh, quad.sprite, quad.anchor);

                this.meshFactory.end();

                return mesh;
            },

            /**
            *   Generate the quad face.
            *
            *   @method generateFace
            *   @param {w} width
            *   @param {h} height
            *   @param {sprite} sprite texture
            *   @param {anchor} anchor point
            *   @returns {undefined}
            */
            generateFace: function(w, h, sprite, anchor) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                var ax, ay, az;
                ax = anchor.x * w;
                ay = anchor.y * h;
                az = anchor.z;

                this.meshFactory.addVertex(new Vector3(-w + ax, -h + ay, az));
                this.meshFactory.addVertex(new Vector3(-w + ax,  h + ay, az));
                this.meshFactory.addVertex(new Vector3( w + ax,  h + ay, az));
                this.meshFactory.addVertex(new Vector3( w + ax, -h + ay, az));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            }
        });

        return QuadController;
    }
);
