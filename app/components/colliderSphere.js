define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var ColliderSphere = function(boundingBox) {
            Component.call(this);

        };

        ColliderSphere.__name__ = 'ColliderSphere';

        ColliderSphere.prototype = _.create(Component.prototype, {
            constructor: ColliderSphere,

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
        });

        return ColliderSphere;
    }
);
