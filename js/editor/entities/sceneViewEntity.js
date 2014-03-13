define([
        'components/view',
        'entities/viewEntity',
        'editor/components/sceneView'
    ],
    function(
        View,
        ViewEntity,
        SceneView
    ) {
        'use strict';
    
        var SceneViewEntity = function(viewRect, direction, projection) {
            ViewEntity.apply(this, [viewRect]);

            direction = direction || SceneView.VIEW_DIRECTION_FRONT;
            projection = projection || SceneView.PROJECTION_PERSPECTIVE;

            var view = this.getComponent('View');
            view.type = View.TYPE_SCENE;

            this.addComponent(new SceneView(direction, projection));
        };

        SceneViewEntity.prototype = Object.create(ViewEntity.prototype);

        SceneViewEntity.prototype.constructor = SceneViewEntity;

        return SceneViewEntity;
    }
);
