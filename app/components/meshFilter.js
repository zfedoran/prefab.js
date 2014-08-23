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

            /**
            *   This method is called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            init: function(entity, context) {
            },

            /**
            *   This method is called when this component is removed from an
            *   entity.
            *
            *   @method uninitialize
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            uninitialize: function(entity, context) {
            },

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
