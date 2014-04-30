define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var Block = function(width, height, depth) {
            Component.call(this);

            this.width  = width;
            this.height = height;
            this.depth  = depth;

            this.top    = null;
            this.bottom = null;
            this.left   = null;
            this.right  = null;
            this.front  = null;
            this.back   = null;

            this.texture = null;
        };

        Block.__name__ = 'Block';

        Block.prototype = _.create(Component.prototype, {
            constructor: Block,

            setAllFacesTo: function(sprite) {
                this.front   = sprite;
                this.left    = sprite;
                this.back    = sprite;
                this.right   = sprite;
                this.top     = sprite;
                this.bottom  = sprite;
                this.texture = sprite.texture;
            }
        });

        return Block;
    }
);
