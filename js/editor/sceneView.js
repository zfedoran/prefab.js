define([
        'entities/camera',
        'entities/guiLayer'
    ],
    function(
        CameraEntity,
        GUILayerEntity
    ) {
        'use strict';
    
        var SceneView = function(entityManager, viewRect) {
            this.viewRect = viewRect;

            this.camera = new CameraEntity(viewRect.width, viewRect.height, 0.1, 500, 75);
            this.guiLayer = new GUILayerEntity(viewRect.width, viewRect.height, viewRect.x, viewRect.y);

            this.entityManager.add(this.camera);
            this.entityManager.add(this.guiLayer);

            //scene
            //grid
            //axis
            //ortho/perspect label
            //buttons: translate, scale, rotate
        
        };

        SceneView.prototype = {
            constructor: SceneView,

        
        };
    
        return SceneView;
    }
);
