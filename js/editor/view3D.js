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
    
        var View3D = function(context, viewRect) {
            this.context        = context;
            this.scene          = context.scene;
            this.entityManager  = context.entityManager;

            this.viewRect = viewRect;

            this.guiLayer = new GUILayerEntity(viewRect.width, viewRect.height, viewRect.x, viewRect.y);
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

            this.scene.addBlock(1, 1, 1);
            this.time = 0;
        };

        View3D.prototype = {
            constructor: View3D,

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
                text.content = camera._viewMatrix.toString();
                text.setDirty(true);
            },

            getWidth: function() {
                return this.viewRect.width;
            },

            getHeight: function() {
                return this.viewRect.height;
            },

            setSize: function(width, height) {
                this.viewRect.width  = width;
                this.viewRect.height = height;

                var cameraComponent, guiLayerComponent;
                cameraComponent = this.camera.getComponent('Camera');
                cameraComponent.width  = width;
                cameraComponent.height = height;
                cameraComponent.setDirty(true);

                guiLayerComponent = this.guiLayer.getComponent('GUILayer');
                guiLayerComponent.boundingBox.width = width;
                guiLayerComponent.boundingBox.height = height;
                guiLayerComponent.setDirty(true);

                cameraComponent = this.guiLayer.getComponent('Camera');
                cameraComponent.width  = width;
                cameraComponent.height = height;
                cameraComponent.setDirty(true);
            }
        };
    
        return View3D;
    }
);
