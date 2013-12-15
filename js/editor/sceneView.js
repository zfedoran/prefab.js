define([
        'math/rectangle',
        'math/vector3',
        'core/scene',
        'graphics/texture',
        'graphics/sprite',
        'entities/block',
        'entities/camera',
        'entities/guiLayer',
        'entities/guiText',
        'entities/grid'
    ],
    function(
        Rectangle,
        Vector3,
        Scene,
        Texture,
        Sprite,
        BlockEntity,
        CameraEntity,
        GUILayerEntity,
        GUITextEntity,
        GridEntity
    ) {
        'use strict';
    
        var SceneView = function(device, entityManager, viewRect) {
            this.device = device;
            this.entityManager = entityManager;
            this.viewRect = viewRect;

            this.guiLayer = new GUILayerEntity(viewRect.width, viewRect.height, viewRect.x+10, viewRect.y+10);
            this.guiLayer.getComponent('Camera').addRenderGroup('SceneViewUI');
            this.entityManager.addEntity(this.guiLayer);

            this.guiText = new GUITextEntity(new Rectangle(0, 0, 1000, 100), 'hello, world');
            this.entityManager.addEntity(this.guiText);
            this.entityManager.addEntityToGroup(this.guiText, 'SceneViewUI');

            this.grid = new GridEntity(10, 10, 10);
            this.grid.getComponent('Grid').hasXYPlane = false;
            this.grid.getComponent('Grid').hasYZPlane = false;
            this.entityManager.addEntity(this.grid);
            this.entityManager.addEntityToGroup(this.grid, 'SceneView');

            this.camera = new CameraEntity(viewRect.width, viewRect.height, 0.1, 500, 75);
            this.camera.getComponent('Camera').addRenderGroup('Scene');
            this.camera.getComponent('Camera').addRenderGroup('SceneView');
            this.entityManager.addEntity(this.camera);

            this.addBlock(1, 1, 1);
            this.time = 0;

            //scene
            //grid
            //axis
            //ortho/perspect label
            //buttons: translate, scale, rotate
        
        };

        SceneView.prototype = {
            constructor: SceneView,

            addBlock: function(width, height, depth) {
                var blockEntity = new BlockEntity(width, height, depth);
                var blockComponent = blockEntity.getComponent('Block');

                width  = width * 4;
                height = height * 4;
                depth  = depth * 4;

                var textureWidth = 2 * width + 4 * depth;
                var textureHeight = Math.max(height, width);

                // TODO: find nearest power of two
                var canvas, ctx, texture;
                canvas = document.createElement('canvas');
                canvas.width = textureWidth; 
                canvas.height = textureHeight;

                ctx = canvas.getContext('2d');
                texture = new Texture(this.device, canvas);

                blockComponent.front  = new Sprite(new Rectangle(0 * width + 0 * depth, 0, width, height), texture);
                blockComponent.left   = new Sprite(new Rectangle(1 * width + 0 * depth, 0, depth, height), texture);
                blockComponent.back   = new Sprite(new Rectangle(1 * width + 1 * depth, 0, width, height), texture);
                blockComponent.right  = new Sprite(new Rectangle(2 * width + 1 * depth, 0, depth, height), texture);
                blockComponent.top    = new Sprite(new Rectangle(2 * width + 2 * depth, 0, depth, width ), texture);
                blockComponent.bottom = new Sprite(new Rectangle(2 * width + 3 * depth, 0, depth, width ), texture);

                blockComponent.texture = texture;

                var material = blockEntity.getComponent('MeshRenderer').material;
                material.diffuseMap = texture;
                material.setDirty(true);

                this.entityManager.addEntity(blockEntity);
                this.entityManager.addEntityToGroup(blockEntity, 'Scene');
            },

            update: function(elapsed) {
                this.time += elapsed;
                var transform = this.camera.getComponent('Transform');
                transform.localPosition.x = Math.sin(this.time * 0.0001) * 5;
                transform.localPosition.y = Math.sin(this.time * 0.0001) * 5;
                transform.localPosition.z = Math.cos(this.time * 0.0001) * 5;
                transform.setDirty(true);

                var camera = this.camera.getComponent('Camera');
                camera.target = new Vector3(0,0,0);
                camera.setDirty(true);

                var text = this.guiText.getComponent('GUIText');
//                text.content = camera._viewMatrix.toString();
                text.setDirty(true);
            },

            draw: function(elapsed) {

            },

            getWidth: function() {
                return this.viewRect.width;
            },

            getHeight: function() {
                return this.viewRect.height;
            }
        };
    
        return SceneView;
    }
);
