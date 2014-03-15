define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var MeshFilter = function(mesh) {
            Component.call(this);

            this.mesh = mesh;
        };

        MeshFilter.__name__ = 'MeshFilter';

        MeshFilter.prototype = _.create(Component.prototype, {
            constructor: MeshFilter
        });

        return MeshFilter;
    }
);
