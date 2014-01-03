define([
        'lodash',
        'math/rectangle',
        'math/vector3',
        'math/vector2',
        'core/view',
        'entities/cameraEntity',
        'entities/guiLayerEntity',
        'entities/guiTextEntity',
        'entities/gridEntity',
        'graphics/meshFactory',
        'graphics/mesh',
        'graphics/material',
        'core/entity',
        'components/transform',
        'components/meshFilter',
        'components/meshRenderer'
    ],
    function(
        _,
        Rectangle,
        Vector3,
        Vector2,
        View,
        CameraEntity,
        GUILayerEntity,
        GUITextEntity,
        GridEntity,
        MeshFactory,
        Mesh,
        Material,
        Entity,
        Transform,
        MeshFilter,
        MeshRenderer
    ) {
        'use strict';
    
        var TextureView = function(context, viewRect) {
            View.apply(this, arguments);

            this.groupNameGUI = this.getGroupInstanceName('ViewGUILayer');
            this.groupName2D  = this.getGroupInstanceName('View2DLayer');

            this.initCamera();
            this.initGrid();
            this.initGUI();
            this.init();
        };

        TextureView.prototype = _.create(View.prototype, {
            constructor: TextureView,

            init: function() {
                this.guiText = new GUITextEntity(new Rectangle(0, 0, 1000, 100), this.uuid + ' Texture');
                this.entityManager.addEntity(this.guiText);
                this.entityManager.addEntityToGroup(this.guiText, this.groupNameGUI);

                this.meshFactory = new MeshFactory(this.device);

                this.unwrapEntity = new Entity();
                this.unwrapEntity.addComponent(new Transform());
                this.unwrapEntity.addComponent(new MeshFilter());
                this.unwrapEntity.addComponent(new MeshRenderer());
                this.entityManager.addEntity(this.unwrapEntity);
                this.entityManager.addEntityToGroup(this.unwrapEntity, this.groupName2D);

                this.currentSelection = this.entityManager.getAllUsingGroupName('CurrentSelection');

                // Find "one" currently selected block
                var entityId, entity;
                for (entityId in this.currentSelection) {
                    if (this.currentSelection.hasOwnProperty(entityId)) {
                        entity = this.currentSelection[entityId];
                        if (entity.hasComponent('Block')) {
                            this.currentBlock = entity;
                            break;
                        }
                    }
                }

                if (typeof this.currentBlock !== 'undefined') {
                    var block = this.currentBlock.getComponent('Block');
                    var material = this.currentBlock.getComponent('MeshRenderer').material;

                    var mesh = this.generateBlockMesh(block);
                    var meshFilter = this.unwrapEntity.getComponent('MeshFilter');
                    meshFilter.mesh = mesh;
                    meshFilter.setDirty(true);

                    var meshRenderer = this.unwrapEntity.getComponent('MeshRenderer');
                    meshRenderer.material = material;
                    meshRenderer.setDirty(true);
                }
            },


            initGUI: function() {
                this.guiLayer = new GUILayerEntity(this.viewRect);
                this.guiLayer.getComponent('Camera').addRenderGroup(this.groupNameGUI);
                this.entityManager.addEntity(this.guiLayer);
            },

            initCamera: function() {
                this.camera = new CameraEntity(this.viewRect, 0, 100);
                this.entityManager.addEntity(this.camera);

                var cameraComponent = this.camera.getComponent('Camera');
                cameraComponent.addRenderGroup(this.groupName2D);
            },

            initGrid: function() {
                this.grid = new GridEntity(100, 100, 100);
                this.entityManager.addEntity(this.grid);
                this.entityManager.addEntityToGroup(this.grid, this.groupName2D);

                var gridComponent = this.grid.getComponent('Grid');
                gridComponent.hasXZPlane = false;
                gridComponent.hasYZPlane = false;
                gridComponent.setDirty(true);
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
            },

            update: function(elapsed) {
            },

            setSize: function(width, height) {
            }
        });

        return TextureView;
    }
);
