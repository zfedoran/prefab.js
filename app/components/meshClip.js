define([
        'lodash',
        'math/boundingBox',
        'core/component'
    ],
    function(
        _,
        BoundingBox,
        Component
    ) {
        'use strict';
    
        var MeshClip = function(boundingBox) {
            Component.call(this);

            // The bounding box to clip a meshFilter mesh by
            this.boundingBox = boundingBox || new BoundingBox();
        };

        MeshClip.__name__ = 'MeshClip';

        MeshClip.prototype = _.create(Component.prototype, {
            constructor: MeshClip,

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
            }
        });

        /**
        *   This method creates a new Mesh clip component using a minimum and
        *   maximum value.
        *
        *   @method 
        *   @param {min}
        *   @param {max}
        *   @returns {undefined}
        */
        MeshClip.createFromMinMax = function(min, max) {
            return new MeshClip(new BoundingBox(min, max));
        };

        return MeshClip;
    }
);
