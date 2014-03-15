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
            constructor: Block
        });

        return Block;
    }
);
