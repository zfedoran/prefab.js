define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        /**
        *   This component creates a grid.
        *
        *   @class 
        *   @param {width} Number of cells wide
        *   @param {height} Number of cells high
        *   @param {depth} Number of cells deep
        *   @constructor
        */
        var Grid = function(width, height, depth) {
            Component.call(this);

            this.width  = width;
            this.height = height;
            this.depth  = depth;

            this.hasXYPlane = depth <= 0;
            this.hasXZPlane = height <= 0;
            this.hasYZPlane = width <= 0;

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
