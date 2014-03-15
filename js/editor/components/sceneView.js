define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var _sceneViewCount = 0;

        var SceneView = function(direction, projection, grid, camera) {
            Component.call(this);

            this.groupNameScene     = 'Scene';
            this.groupNameSceneView = 'SceneView' + _sceneViewCount;
            this.cameraEntity = camera;

            this.direction  = direction;
            this.projection = projection;

            this.gridEntity = grid;

            this.state = SceneView.STATE_NONE;

            this.isInitialized = false;

            _sceneViewCount++;
        };

        SceneView.__name__ = 'SceneView';

        SceneView.prototype = _.create(Component.prototype, {
            constructor: SceneView
        });

        SceneView.PROJECTION_ORTHOGRAPHIC = 'orthographic';
        SceneView.PROJECTION_PERSPECTIVE  = 'perspective';

        SceneView.VIEW_DIRECTION_TOP    = 'top';
        SceneView.VIEW_DIRECTION_BOTTOM = 'bottom';
        SceneView.VIEW_DIRECTION_LEFT   = 'left';
        SceneView.VIEW_DIRECTION_RIGHT  = 'right';
        SceneView.VIEW_DIRECTION_FRONT  = 'front';
        SceneView.VIEW_DIRECTION_BACK   = 'back';
        SceneView.VIEW_DIRECTION_CUSTOM = 'custom';

        SceneView.STATE_NONE   = 'none';
        SceneView.STATE_ZOOM   = 'zoom';
        SceneView.STATE_ROTATE = 'rotate';
        SceneView.STATE_PAN    = 'pan';

        return SceneView;
    }
);
