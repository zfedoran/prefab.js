define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var _viewCount = 0;

        var View = function(type, gui, camera) {
            Component.call(this);

            this.type = type;

            this.groupNameGUI    = 'ViewGUI' + _viewCount;
            this.groupNameCamera = 'ViewCamera' + _viewCount;

            this.guiLayerEntity = gui;
            this.cameraEntity   = camera;

            this.isInitialized  = false;

            _viewCount++;
        };

        View.__name__ = 'View';

        View.prototype = _.create(Component.prototype, {
            constructor: View
        });

        View.TYPE_SCENE   = 'scene';
        View.TYPE_TEXTURE = 'texture';

        return View;
    }
);
