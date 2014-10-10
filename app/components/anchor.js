define([
        'lodash',
        'core/component',
        'math/vector3'
    ],
    function(
        _,
        Component,
        Vector3
    ) {
        'use strict';

        /**
        *   The Anchor component class.
        *
        *   @class 
        *   @constructor
        *   @param {x}
        *   @param {y}
        *   @param {z}
        */
        var Anchor = function(x, y, z) {
            Component.call(this);

            // Center point for this entity
            this.anchorPoint = new Vector3();
        };

        Anchor.__name__ = 'Anchor';

        Anchor.prototype = _.create(Component.prototype, {
            constructor: Anchor,

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

            /**
            *   This method sets the anchor (center) point of the entity as
            *   normalized half bounding box coordinates. (i.e. -1.0 or 1.0
            *   will offset the entity by half on a particular axis).
            *
            *   @method setAnchorPoint
            *   @param {x}
            *   @param {y}
            *   @param {z}
            *   @returns {undefined}
            */
            setAnchorPoint: function(x, y, z) {
                x = typeof x !== 'undefined' ? x : 0;
                y = typeof y !== 'undefined' ? y : 0;
                z = typeof z !== 'undefined' ? z : 0;
                this.anchorPoint.set(x, y, z);

                var bounds = this.getComponent('Bounds');
                if (bounds) {
                    bounds.setDirty(true);
                }
            },

            /**
            *   This method returns the anchor point (center) of this entity.
            *
            *   @method getAnchorPoint
            *   @returns {undefined}
            */
            getAnchorPoint: function() {
                return this.anchorPoint;
            }
        });

        return Anchor;
    }
);
