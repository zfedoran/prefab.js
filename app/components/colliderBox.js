define([
        'lodash',
        'core/component',
        'math/boundingBox'
    ],
    function(
        _,
        Component,
        BoundingBox
    ) {
        'use strict';

        var ColliderBox = function(boundingBox) {
            Component.call(this);

            if (typeof boundingBox === 'undefined') {
                boundingBox = new BoundingBox();
            }

            this.isTrigger   = false;
            this.boundingBox = new BoundingBox();
        };

        ColliderBox.__name__ = 'ColliderBox';

        ColliderBox.prototype = _.create(Component.prototype, {
            constructor: ColliderBox,

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

            getBoundingBox: function() {
                return this.boundingBox;
            },

            setBoundingBox: function(boundingBox) {
                this.boundingBox.setFrom(boundingBox);
            }
        });

        ColliderBox.createFromMesh = function(mesh) {
            return new ColliderBox(mesh.getBoundingBox());
        };

        ColliderBox.createFromMinMax = function(min, max) {
            return new ColliderBox(new BoundingBox(min, max));
        };

        return ColliderBox;
    }
);
