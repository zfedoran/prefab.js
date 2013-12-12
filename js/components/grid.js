define([
        'core/component'
    ],
    function(
        Component
    ) {
        'use strict';

        var Grid = function(width, height, depth) {
            Component.call(this);

            this.width  = width;
            this.height = height;
            this.depth  = depth;
        };

        Grid.__name__ = 'Grid';

        Grid.prototype = Object.create(Component.prototype);

        Grid.prototype.constructor = Grid;

        return Grid;
    }
);
