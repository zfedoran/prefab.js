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
    
        var tmp = 0;
        var View3D = function(context, viewRect) {
            tmp++;
            this.tmp = tmp;
            this.context        = context;
            this.scene          = context.scene;
            this.entityManager  = context.entityManager;

            this.viewRect = viewRect;

            this.guiLayer = new GUILayerEntity(viewRect);
            this.guiLayer.getComponent('Camera').addRenderGroup('SceneViewUI'+this.tmp);
            this.entityManager.addEntity(this.guiLayer);

            this.guiText = new GUITextEntity(new Rectangle(0, 0, 1000, 100), 'hello, world');
            this.entityManager.addEntity(this.guiText);
            this.entityManager.addEntityToGroup(this.guiText, 'SceneViewUI'+this.tmp);

            this.grid = new GridEntity(10*this.tmp, 10*this.tmp, 10*this.tmp);
            this.grid.getComponent('Grid').hasXYPlane = false;
            this.grid.getComponent('Grid').hasYZPlane = false;
            this.entityManager.addEntity(this.grid);
            this.entityManager.addEntityToGroup(this.grid, 'SceneView'+this.tmp);

            this.camera = new CameraEntity(viewRect, 0.1, 500, 75);
            this.camera.getComponent('Camera').addRenderGroup('Scene');
            this.camera.getComponent('Camera').addRenderGroup('SceneView'+this.tmp);
            this.entityManager.addEntity(this.camera);

            this.time = 0;
        };

        View3D.prototype = {
            constructor: View3D,

            update: function(elapsed) {
                this.time += elapsed;
                var transform = this.camera.getComponent('Transform');
                transform.localPosition.x = Math.sin(this.time * 0.0001*this.tmp) * 5*this.tmp;
                transform.localPosition.y = Math.sin(this.time * 0.0001) * 5*this.tmp;
                transform.localPosition.z = Math.cos(this.time * 0.0001) * 5*this.tmp;
                transform.setDirty(true);

                var camera = this.camera.getComponent('Camera');
                camera.target = new Vector3(0,0,0);
                camera.setDirty(true);

                var text = this.guiText.getComponent('GUIText');
                text.content = this.tmp + '\n' + camera._viewMatrix.toString();
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

                var cameraComponent;
                cameraComponent = this.camera.getComponent('Camera');
                cameraComponent.width  = width;
                cameraComponent.height = height;
                cameraComponent.setDirty(true);

                cameraComponent = this.guiLayer.getComponent('Camera');
                cameraComponent.width  = width;
                cameraComponent.height = height;
                cameraComponent.setDirty(true);
            }
        };
    
        return View3D;
    }
);
