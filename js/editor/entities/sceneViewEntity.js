define([
        'lodash',
        'components/view',
        'entities/viewEntity',
        'editor/components/sceneView'
    ],
    function(
        _,
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

        SceneViewEntity.prototype = _.create(ViewEntity.prototype, {
            constructor: SceneViewEntity
        });

        return SceneViewEntity;
    }
);
