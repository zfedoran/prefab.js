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
            constructor: MeshFilter,

            getMesh: function() {
                return this.mesh;
            },

            setMesh: function(mesh) {
                this.mesh = mesh;
            }
        });

        return MeshFilter;
    }
);
