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

        /**
        *   The Bounds component class.
        *
        *   @class 
        *   @constructor
        */
        var Bounds = function() {
            Component.call(this);

            // Local bounding box
            this.localBoundingBox = new BoundingBox();
        };

        Bounds.__name__ = 'Bounds';

        Bounds.prototype = _.create(Component.prototype, {
            constructor: Bounds,

            /**
            *   This method is called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            init: function(entity, context) {
                this._entity = entity;
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
                this._entity = null;
            },

            /**
            *   This method returns the local bounding box for this entity.
            *
            *   @method getLocalBoundingBox
            *   @returns {undefined}
            */
            getLocalBoundingBox: function() {
                if (this.isDirty()) {
                    this.update();
                }

                return this.localBoundingBox;
            },

            /**
            *   This method sets the local bounding box for this entity.
            *
            *   @method setLocalBoundingBox
            *   @param {boundingBox}
            *   @returns {undefined}
            */
            setLocalBoundingBox: function(boundingBox) {
                var dimensions = this.getComponent('Dimensions');
                if (dimensions) {
                    dimensions.setDirty(true);
                }

                this.localBoundingBox = boundingBox;
            },

            /**
            *   This method updates the local bounding box using the Dimensions
            *   and Transform components attached to this entity.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                var anchor     = this.getComponent('Anchor');
                var dimensions = this.getComponent('Dimensions');
                var transform  = this.getComponent('Transform');

                // If this entity has a Dimensions component
                if (dimensions) {

                    // If this entity has a Transform component
                    if (transform) {

                        // Get the anchor point values (if they exist)
                        var ax = 0, ay = 0, az = 0;
                        if (anchor) { 
                            ax = anchor.anchorPoint.x;
                            ay = anchor.anchorPoint.y;
                            az = anchor.anchorPoint.z;
                        }

                        var hw = dimensions.localWidth * 0.5;
                        var hh = dimensions.localHeight * 0.5;
                        var hd = dimensions.localDepth * 0.5;

                        var px = transform.localPosition.x;
                        var py = transform.localPosition.y;
                        var pz = transform.localPosition.z;

                        px = px + ax * hw;
                        py = py + ay * hh;
                        pz = pz + az * hd;

                        this.localBoundingBox.min.x = px - hw;
                        this.localBoundingBox.min.y = py - hh;
                        this.localBoundingBox.min.z = pz - hd;

                        this.localBoundingBox.max.x = px + hw;
                        this.localBoundingBox.max.y = py + hh;
                        this.localBoundingBox.max.z = pz + hd;

                        this.setDirty(false);
                    } else {
                        throw 'Bounds: cannot update dirty local boundingBox value without a Transform component.';
                    }
                } else {
                    throw 'Bounds: cannot update dirty local boundingBox value without a Dimensions component.';
                }
            },
        });

        return Bounds;
    }
);
