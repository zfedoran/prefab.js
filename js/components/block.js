define([
        'core/component'
    ],
    function(
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
        };

        Block.__name__ = 'Block';

        Block.prototype = Object.create(Component.prototype);

        Block.prototype.constructor = Block;

        return Block;
    }
);
