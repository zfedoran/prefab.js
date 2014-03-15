define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var Grid = function(width, height, depth) {
            Component.call(this);

            this.width  = width;
            this.height = height;
            this.depth  = depth;

            this.hasXYPlane = true;
            this.hasXZPlane = true;
            this.hasYZPlane = true;

            this.hasXAxis = true;
            this.hasYAxis = true;
            this.hasZAxis = true;
        };

        Grid.__name__ = 'Grid';

        Grid.prototype = _.create(Component.prototype, {
            constructor: Grid
        });

        return Grid;
    }
);
