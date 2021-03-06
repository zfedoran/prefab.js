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
        *   Block component.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var BlockController = function(context) {
            Controller.call(this, context);

            this.meshFactory = new MeshFactory(this.device);
        };

        BlockController.prototype = _.create(Controller.prototype, {
            constructor: BlockController,

            /**
            *   Update all entities which contain the Block and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'Block', 'Dimensions', 'MeshFilter'], function(entity) {
                    var block      = entity.getComponent('Block');
                    var dimensions = entity.getComponent('Dimensions');

                    if (block.isDirty() || dimensions.isDirty()) {
                        var meshFilter = entity.getComponent('MeshFilter');
                        var mesh       = meshFilter.getMesh();

                        if (mesh) {
                            mesh.destroy();
                        } else {
                            mesh = new Mesh(this.device, Mesh.TRIANGLES);
                        }

                        this.generateBlockMesh(entity, mesh);
                        meshFilter.setMesh(mesh);

                        block.setDirty(false);
                    }
                }, this);
            },

            /**
            *   Generate the 6 faces of a block and return a mesh.
            *
            *   @method generateBlockMesh
            *   @param {entity}
            *   @param {mesh}
            *   @returns {mesh}
            */
            generateBlockMesh: function(entity, mesh) {
                var block      = entity.getComponent('Block');
                var dimensions = entity.getComponent('Dimensions');

                var w, h, d, hw, hh, hd;

                w = dimensions.getWidth();
                h = dimensions.getHeight();
                d = dimensions.getDepth();

                hw = w / 2;
                hh = h / 2;
                hd = d / 2;

                this.meshFactory.begin(mesh);

                this.generateFaceFront(hw, hh, hd, block.front);
                this.generateFaceBack(hw, hh, hd, block.back);
                this.generateFaceLeft(hw, hh, hd, block.left);
                this.generateFaceRight(hw, hh, hd, block.right);
                this.generateFaceTop(hw, hh, hd, block.top);
                this.generateFaceBottom(hw, hh, hd, block.bottom);

                this.meshFactory.end();

                return mesh;
            },

            /**
            *   Generate the front face of a block.
            *
            *   @method generateFaceFront
            *   @param {w} width
            *   @param {h} height
            *   @param {d} depth
            *   @param {sprite} sprite texture
            *   @returns {undefined}
            */
            generateFaceFront: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                this.meshFactory.addVertex(new Vector3(-w, -h, d));
                this.meshFactory.addVertex(new Vector3(-w,  h, d));
                this.meshFactory.addVertex(new Vector3( w,  h, d));
                this.meshFactory.addVertex(new Vector3( w, -h, d));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            },

            /**
            *   Generate the back face of a block.
            *
            *   @method generateFaceBack
            *   @param {w} width
            *   @param {h} height
            *   @param {d} depth
            *   @param {sprite} sprite texture
            *   @returns {undefined}
            */
            generateFaceBack: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                this.meshFactory.addVertex(new Vector3(-w, -h, -d));
                this.meshFactory.addVertex(new Vector3(-w,  h, -d));
                this.meshFactory.addVertex(new Vector3( w,  h, -d));
                this.meshFactory.addVertex(new Vector3( w, -h, -d));

                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 3);
            },

            /**
            *   Generate the left face of a block.
            *
            *   @method generateFaceLeft
            *   @param {w} width
            *   @param {h} height
            *   @param {d} depth
            *   @param {sprite} sprite texture
            *   @returns {undefined}
            */
            generateFaceLeft: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                this.meshFactory.addVertex(new Vector3(-w, -h, -d));
                this.meshFactory.addVertex(new Vector3(-w,  h, -d));
                this.meshFactory.addVertex(new Vector3(-w,  h,  d));
                this.meshFactory.addVertex(new Vector3(-w, -h,  d));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            },

            /**
            *   Generate the right face of a block.
            *
            *   @method generateFaceRight
            *   @param {w} width
            *   @param {h} height
            *   @param {d} depth
            *   @param {sprite} sprite texture
            *   @returns {undefined}
            */
            generateFaceRight: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                this.meshFactory.addVertex(new Vector3(w, -h, -d));
                this.meshFactory.addVertex(new Vector3(w,  h, -d));
                this.meshFactory.addVertex(new Vector3(w,  h,  d));
                this.meshFactory.addVertex(new Vector3(w, -h,  d));

                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 3);
            },

            /**
            *   Generate the top face of a block.
            *
            *   @method generateFaceTop
            *   @param {w} width
            *   @param {h} height
            *   @param {d} depth
            *   @param {sprite} sprite texture
            *   @returns {undefined}
            */
            generateFaceTop: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                this.meshFactory.addVertex(new Vector3(-w, h, -d));
                this.meshFactory.addVertex(new Vector3( w, h, -d));
                this.meshFactory.addVertex(new Vector3( w, h,  d));
                this.meshFactory.addVertex(new Vector3(-w, h,  d));

                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            },

            /**
            *   Generate the bottom face of a block.
            *
            *   @method generateFaceBottom
            *   @param {w} width
            *   @param {h} height
            *   @param {d} depth
            *   @param {sprite} sprite texture
            *   @returns {undefined}
            */
            generateFaceBottom: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                this.meshFactory.addVertex(new Vector3(-w, -h, -d));
                this.meshFactory.addVertex(new Vector3( w, -h, -d));
                this.meshFactory.addVertex(new Vector3( w, -h,  d));
                this.meshFactory.addVertex(new Vector3(-w, -h,  d));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 3);
            }
        });

        return BlockController;
    }
);
