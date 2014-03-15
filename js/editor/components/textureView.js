define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var _textureViewCount = 0;

        var TextureView = function(zoom, grid, unwrap, camera) {
            Component.call(this);

            this.groupNameTextureView = 'TextureView' + _textureViewCount;
            this.cameraEntity = camera;

            this.zoom = zoom;
            
            this.gridEntity   = grid;
            this.unwrapEntity = unwrap;
            this.currentBlock = null;

            this.isInitialized = false;

            _textureViewCount++;
        };

        TextureView.__name__ = 'TextureView';

        TextureView.prototype = _.create(Component.prototype, {
            constructor: TextureView
        });

        TextureView.STATE_NONE   = 'none';
        TextureView.STATE_ZOOM   = 'zoom';
        TextureView.STATE_PAN    = 'pan';

        return TextureView;
    }
);
