define([
        'math/vector2',
        'math/vector3',
        'math/vector4'
    ],
    function(
        Vector2,
        Vector3,
        Vector4
    ) {
        'use strict';
    
        /**
        *   A 3d bounding box.
        *
        *   @class 
        *   @param {min}
        *   @param {max}
        *   @constructor
        */
        var BoundingBox = function(min, max) {
            this.min = min || new Vector3(Infinity, Infinity, Infinity);
            this.max = max || new Vector3(-Infinity, -Infinity, -Infinity);
        };

        BoundingBox.prototype = {
            constructor: BoundingBox,

            /**
            *   This method sets this bounding box from the provided bounding
            *   box.
            *
            *   @method setFrom
            *   @param {boundingBox}
            *   @returns {undefined}
            */
            setFrom: function(boundingBox) {
                this.min.setFrom(boundingBox.min);
                this.max.setFrom(boundingBox.max);
            },

            /**
            *   This method checks if the bounding box values are valid numbers
            *
            *   @method isValid
            *   @returns {undefined}
            */
            isValid: function() {
                return (this.min.isValid() 
                     && this.max.isValid()
                     && this.min.x <= this.max.x
                     && this.min.y <= this.max.y
                     && this.min.z <= this.max.z);
            },

            /**
            *   This method expands the bounding box to include the provided
            *   vector. The vector can be either a Vector2, Vector3, or
            *   Vector4.
            *
            *   @method expandByVector
            *   @param {vector} 
            *   @returns {undefined}
            */
            expandByVector: function(vector) {
                this.min.x = Math.min(this.min.x, vector.x);
                this.max.x = Math.max(this.max.x, vector.x);
                this.min.y = Math.min(this.min.y, vector.y);
                this.max.y = Math.max(this.max.y, vector.y);

                if (typeof vector.z !== 'undefined') {
                    this.min.z = Math.min(this.min.z, vector.z);
                    this.max.z = Math.max(this.max.z, vector.z);
                } 
            },

            /**
            *   This method resets this bounding box to an empty state
            *
            *   @method makeEmpty
            *   @returns {undefined}
            */
            makeEmpty: function () {
                this.min.x = this.min.y = this.min.z = Infinity;
                this.max.x = this.max.y = this.max.z = -Infinity;
            },

            /**
            *   This method checks if the bounding box is empty
            *
            *   @method isEmpty
            *   @returns {boolean}
            */
            isEmpty: function () {
                return (this.max.x < this.min.x) 
                    || (this.max.y < this.min.y) 
                    || (this.max.z < this.min.z);
            },

            /**
            *   This method returns true if the provided point is inside the
            *   bounding box.
            *
            *   @method containsPoint
            *   @param {point}
            *   @returns {boolean}
            */
            containsPoint: function (point) {
                return !(point.x < this.min.x 
                      || point.x > this.max.x 
                      || point.y < this.min.y 
                      || point.y > this.max.y 
                      || point.z < this.min.z 
                      || point.z > this.max.z);
            },

            /**
            *   This method returns true if the provided bounding box is inside
            *   this bounding box.
            *
            *   @method containsBox
            *   @param {box}
            *   @returns {boolean}
            */
            containsBox: function (box) {
                return ((this.min.x <= box.min.x) && (box.max.x <= this.max.x) &&
                        (this.min.y <= box.min.y) && (box.max.y <= this.max.y) &&
                        (this.min.z <= box.min.z) && (box.max.z <= this.max.z));
            },

            /**
            *   This method returns true if the provided bounding box
            *   intersects this box.
            *
            *   @method intersectsBox
            *   @param {box}
            *   @returns {boolean}
            */
            intersectsBox: function (box) {
                // using 6 splitting planes to rule out intersections.
                if (box.max.x < this.min.x || box.min.x > this.max.x ||
                    box.max.y < this.min.y || box.min.y > this.max.y ||
                    box.max.z < this.min.z || box.min.z > this.max.z) {
                    return false;
                }
                return true;
            },

            /**
            *   This method returns the width of this bounding box.
            *
            *   @method getWidth
            *   @returns {undefined}
            */
            getWidth: function() {
                return this.max.x - this.min.x;
            },

            /**
            *   This method returns the height of this bounding box.
            *
            *   @method getHeight
            *   @returns {undefined}
            */
            getHeight: function() {
                return this.max.y - this.min.y;
            },

            /**
            *   This method returns the depth of this bounding box.
            *
            *   @method getDepth
            *   @returns {undefined}
            */
            getDepth: function() {
                return this.max.z - this.min.z;
            },

            toString: function() {
                return '{ min: ' + this.min.toString() 
                     + ', max: ' + this.max.toString() + ' }';
            }
        };

        return BoundingBox;
    }
);
