define([
        'core/entity',
        'components/guiElement',
        'editor/components/view',
        'editor/components/sceneView'
    ],
    function(
        Entity,
        GUIElement,
        View,
        SceneView
    ) {
        'use strict';
    
        var SceneViewEntity = function(viewRect, direction, projection) {
            Entity.call(this);

            direction = direction || SceneView.VIEW_DIRECTION_FRONT;
            projection = projection || SceneView.PROJECTION_PERSPECTIVE;

            this.addComponent(new GUIElement(viewRect));
            this.addComponent(new View(View.TYPE_TEXTURE));
            this.addComponent(new SceneView(direction, projection));
        };

        SceneViewEntity.prototype = Object.create(Entity.prototype);

        SceneViewEntity.prototype.constructor = SceneViewEntity;

        return SceneViewEntity;
    }
);
