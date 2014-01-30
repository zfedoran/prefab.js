define([
        'core/component'
    ],
    function(
        Component
    ) {
        'use strict';

        var TextureView = function(zoom, grid, unwrap) {
            Component.call(this);

            this.zoom = zoom;
            
            this.gridEntity   = grid;
            this.unwrapEntity = unwrap;
            this.currentBlock = null;

            this.isInitialized = false;
        };

        TextureView.__name__ = 'TextureView';

        TextureView.prototype = Object.create(Component.prototype);

        TextureView.prototype.constructor = TextureView;

        return TextureView;
    }
);