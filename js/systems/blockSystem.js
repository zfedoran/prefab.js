define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/subSystem',
        'graphics/meshFactory',
        'graphics/mesh'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        SubSystem,
        MeshFactory,
        Mesh
    ) {
        'use strict';

        var BlockSystem = function(entityManager, device) {
            SubSystem.call(this, entityManager, ['Block', 'MeshFilter']);
            this.device = device;
            this.meshFactory = new MeshFactory(this.device);
        };

        BlockSystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: BlockSystem,

            update: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);
                var o, entity, guiElement;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('Block')) {
                            this.updateBlock(entity);
                        }
                    }
                }
            },

            updateBlock: function(entity) {
                var transform  = entity.getComponent('Transform');
                var block      = entity.getComponent('Block');
                var meshFilter = entity.getComponent('MeshFilter');

                if (block.isDirty()) {
                    if (typeof meshFilter.mesh !== 'undefined') {
                        meshFilter.mesh.destroy();
                    }
                    meshFilter.mesh = this.generateBlockMesh(block);
                    block.setDirty(false);
                }
            },

            generateBlockMesh: function(block) {
                var w, h, d, hw, hh, hd;

                w = block.width;
                h = block.height;
                d = block.depth;

                hw = w / 2;
                hh = w / 2;
                hd = w / 2;

                var vertexCount = 0;

                var mesh = new Mesh(this.device, Mesh.TRIANGLES);
                this.meshFactory.begin(mesh);

                this.generateFaceFront(w, h, d, block.front);
                this.generateFaceBack(w, h, d, block.back);
                this.generateFaceLeft(w, h, d, block.left);
                this.generateFaceRight(w, h, d, block.right);
                this.generateFaceTop(w, h, d, block.top);
                this.generateFaceBottom(w, h, d, block.bottom);

                this.meshFactory.end();

                return mesh;
            },

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

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            },

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

                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 3);
            },

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

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            },

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

                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 3);
            },

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

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            },

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

        return BlockSystem;
    }
);
