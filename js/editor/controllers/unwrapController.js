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

        var UnwrapController = function(context) {
            Controller.call(this, context, ['Unwrap', 'MeshFilter']);

            this.meshFactory = new MeshFactory(this.device);
        };

        UnwrapController.prototype = _.extend(Object.create(Controller.prototype), {
            constructor: UnwrapController,

            update: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);
                var o, entity, guiElement;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('Unwrap')) {
                            this.updateUnwrap(entity);
                        }
                    }
                }
            },

            updateUnwrap: function(entity) {
                var transform  = entity.getComponent('Transform');
                var unwrap     = entity.getComponent('Unwrap');
                var meshFilter = entity.getComponent('MeshFilter');

                if (unwrap.isDirty()) {
                    var unwrapEntity = unwrap.blockEntity;
                    if (typeof unwrapEntity !== 'undefined') {
                        var block = unwrapEntity.getComponent('Block');
                        if (typeof block !== 'undefined') {
                            if (typeof meshFilter.mesh !== 'undefined') {
                                meshFilter.mesh.destroy();
                            }
                            meshFilter.mesh = this.generateBlockMesh(block);
                        }
                    }
                    unwrap.setDirty(false);
                }
            },

            generateBlockMesh: function(block) {
                var w, h, d, hw, hh, hd;

                w = block.width;
                h = block.height;
                d = block.depth;

                hw = w / 2;
                hh = h / 2;
                hd = d / 2;

                var vertexCount = 0;

                var mesh = new Mesh(this.context.device, Mesh.TRIANGLES);
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

            generateFaceFront: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                var dx, dy;
                dx = -w-d-d;
                dy = 0;

                this.meshFactory.addVertex(new Vector3(-w+dx, -h+dy, 0));
                this.meshFactory.addVertex(new Vector3(-w+dx,  h+dy, 0));
                this.meshFactory.addVertex(new Vector3( w+dx,  h+dy, 0));
                this.meshFactory.addVertex(new Vector3( w+dx, -h+dy, 0));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 3);
            },

            generateFaceBack: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                var dx, dy;
                dx = w;
                dy = 0;

                this.meshFactory.addVertex(new Vector3(-w+dx, -h+dy, 0));
                this.meshFactory.addVertex(new Vector3(-w+dx,  h+dy, 0));
                this.meshFactory.addVertex(new Vector3( w+dx,  h+dy, 0));
                this.meshFactory.addVertex(new Vector3( w+dx, -h+dy, 0));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

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

                var dx, dy;
                dx = -d;
                dy = 0;

                this.meshFactory.addVertex(new Vector3(-d+dx, -h+dy, 0));
                this.meshFactory.addVertex(new Vector3(-d+dx,  h+dy, 0));
                this.meshFactory.addVertex(new Vector3( d+dx,  h+dy, 0));
                this.meshFactory.addVertex(new Vector3( d+dx, -h+dy, 0));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 3);
            },

            generateFaceRight: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                var dx, dy;
                dx = w+w+d;
                dy = 0;

                this.meshFactory.addVertex(new Vector3(-d+dx, -h+dy, 0));
                this.meshFactory.addVertex(new Vector3(-d+dx,  h+dy, 0));
                this.meshFactory.addVertex(new Vector3( d+dx,  h+dy, 0));
                this.meshFactory.addVertex(new Vector3( d+dx, -h+dy, 0));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

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

                var dx, dy;
                dx = w+w+d;
                dy = -h-w;

                this.meshFactory.addVertex(new Vector3(-d+dx, -w+dy, 0));
                this.meshFactory.addVertex(new Vector3(-d+dx,  w+dy, 0));
                this.meshFactory.addVertex(new Vector3( d+dx,  w+dy, 0));
                this.meshFactory.addVertex(new Vector3( d+dx, -w+dy, 0));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 3);
            },

            generateFaceBottom: function(w, h, d, sprite) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                var dx, dy;
                dx = -d;
                dy = h+w;

                this.meshFactory.addVertex(new Vector3(-d+dx, -w+dy, 0));
                this.meshFactory.addVertex(new Vector3(-d+dx,  w+dy, 0));
                this.meshFactory.addVertex(new Vector3( d+dx,  w+dy, 0));
                this.meshFactory.addVertex(new Vector3( d+dx, -w+dy, 0));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 1, vertexCount + 2);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 3);
            }
        });

        return UnwrapController;
    }
);
