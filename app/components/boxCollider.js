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

        var BoxCollider = function(boundingBox) {
            Component.call(this);

            if (typeof boundingBox === 'undefined') {
                boundingBox = new BoundingBox();
            }

            this.isTrigger   = false;
            this.boundingBox = boundingBox;
        };

        BoxCollider.__name__ = 'BoxCollider';

        BoxCollider.prototype = _.create(Component.prototype, {
            constructor: BoxCollider,

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
                this.boundingBox = boundingBox;
            }
        });

        BoxCollider.createFromMesh = function(mesh) {
            return new BoxCollider(mesh.getBoundingBox());
        };

        BoxCollider.createFromMinMax = function(min, max) {
            return new BoxCollider(new BoundingBox(min, max));
        };

        return BoxCollider;
    }
);
