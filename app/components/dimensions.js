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
        *   The Dimensions component class.
        *
        *   @class 
        *   @constructor
        *   @param {width}
        *   @param {height}
        *   @param {depth}
        */
        var Dimensions = function(width, height, depth) {
            Component.call(this);

            // Local size values
            this.localWidth  = typeof width !== 'undefined' ? width : 0;
            this.localHeight = typeof height !== 'undefined' ? height : 0;
            this.localDepth  = typeof depth !== 'undefined' ? depth : 0;
        };

        Dimensions.__name__ = 'Dimensions';

        Dimensions.prototype = _.create(Component.prototype, {
            constructor: Dimensions,

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
            *   This method sets the local (non-world space) width, height, and
            *   depth for this entity.
            *
            *   @method setDimensions
            *   @param {width}
            *   @param {height}
            *   @param {depth}
            *   @returns {undefined}
            */
            setDimensions: function(width, height, depth) {
                width  = typeof width !== 'undefined'  ? width : 0;
                height = typeof height !== 'undefined' ? height : 0;
                depth  = typeof depth !== 'undefined'  ? depth : 0;

                this.localWidth  = width;
                this.localHeight = height;
                this.localDepth  = depth;

                var bounds = this.getComponent('Bounds');
                if (bounds) {
                    bounds.setDirty(true);
                }
            },

            /**
            *   This method sets the local (non-world space) width value for
            *   this entity.
            *
            *   @method setWidth
            *   @param {value}
            *   @returns {undefined}
            */
            setWidth: function(value) {
                this.localWidth = value;
                var bounds = this.getComponent('Bounds');
                if (bounds) {
                    bounds.setDirty(true);
                }
            },

            /**
            *   This method returns the local width value for this entity.
            *
            *   @method getWidth
            *   @returns {undefined}
            */
            getWidth: function() {
                if (this.isDirty()) { this.update(); }
                return this.localWidth;
            },

            /**
            *   This method sets the local (non-world space) height value for
            *   this entity.
            *
            *   @method setHeight
            *   @param {value}
            *   @returns {undefined}
            */
            setHeight: function(value) {
                this.localHeight = value;
                var bounds = this.getComponent('Bounds');
                if (bounds) {
                    bounds.setDirty(true);
                }
            },

            /**
            *   This method returns the local height value for this entity.
            *
            *   @method getHeight
            *   @returns {undefined}
            */
            getHeight: function() {
                if (this.isDirty()) { this.update(); }
                return this.localHeight;
            },

            /**
            *   This method sets the local (non-world space) depth value for
            *   this entity.
            *
            *   @method setDepth
            *   @param {value}
            *   @returns {undefined}
            */
            setDepth: function(value) {
                this.localDepth = value;
                var bounds = this.getComponent('Bounds');
                if (bounds) {
                    bounds.setDirty(true);
                }
            },

            /**
            *   This method returns the local depth value for this entity.
            *
            *   @method getDepth
            *   @returns {undefined}
            */
            getDepth: function() {
                if (this.isDirty()) { this.update(); }
                return this.localDepth;
            },

            /**
            *   This method returns the volume of the entity.
            *
            *   @method getVolume
            *   @returns {undefined}
            */
            getVolume: function() {
                if (this.isDirty()) { this.update(); }
                return this.localWidth * this.localHeight * this.localDepth;
            },

            /**
            *   This method updates dirty local dimensions using the Bounds
            *   component. If the bounds component is missing, an error is
            *   thrown.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.setDirty(false);
                /*
                var bounds = this.getComponent('Bounds');

                // If this entity has a Bounds component, calculate the
                // local width using the local bounding box.
                if (bounds) {
                    var boundingBox  = bounds.getLocalBoundingBox();

                    this.localWidth  = boundingBox.max.x - boundingBox.min.x;
                    this.localHeight = boundingBox.max.y - boundingBox.min.y;
                    this.localDepth  = boundingBox.max.z - boundingBox.min.z;

                } else {
                    throw 'Dimensions: cannot udpate dirty dimensions without a Bounds component.';
                }
                */
            }
        });

        return Dimensions;
    }
);
