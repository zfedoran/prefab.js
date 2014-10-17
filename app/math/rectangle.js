define([
    ],
    function(
    ) {
        'use strict';

        var Rectangle = function(x, y, width, height) {
            this.x      = typeof x !== 'undefined' ? x : -Infinity;
            this.y      = typeof y !== 'undefined' ? y : -Infinity;
            this.width  = typeof width !== 'undefined' ? width : Infinity;
            this.height = typeof height !== 'undefined' ? height : Infinity;
        };

        Rectangle.prototype = {
            constructor: Rectangle,

            set: function(x, y, width, height) {
                this.x      = typeof x !== 'undefined' ? x : -Infinity;
                this.y      = typeof y !== 'undefined' ? y : -Infinity;
                this.width  = typeof width !== 'undefined' ? width : Infinity;
                this.height = typeof height !== 'undefined' ? height : Infinity;
                return this;
            },

            setFrom: function(rect) {
                return this.set(rect.x, rect.y, rect.width, rect.height);
            },

            equals: function(rect) {
                return ((rect.x === this.x) 
                     && (rect.y === this.y)
                     && (rect.width === this.width)
                     && (rect.height === this.height));
            },

            clone: function() {
                return new Rectangle(this.x, this.y, this.width, this.height);
            },

            isValid: function() {
                return !(isNaN(this.x) 
                      || isNaN(this.y)
                      || isNaN(this.width)
                      || isNaN(this.height));
            },

            contains: function(position) {
                return (position.x >= this.x 
                     && position.x <= this.x + this.width
                     && position.y >= this.y
                     && position.y <= this.y + this.height);
            },

            clip: (function() { 
                var tmp = new Rectangle();
                return function(rect) {
                    Rectangle.clip(this, rect, /*out*/ tmp);
                    return this.setFrom(tmp);
                };
            })(),

            toArray: function() {
                return [this.x, this.y, this.width, this.height];
            },

            toString: function() {
                return '[ ' + this.x + ', ' + this.y + ', ' + this.width +', ' + this.height + ' ]';
            }
        };

        Rectangle.clone = function(rect) {
            return new Rectangle(rect.x, rect.y, rect.width, rect.height);
        };

        /**
        *   This method clips the provided rectangle using the provided masking
        *   rectangle.
        *
        *   @method 
        *   @param {rect}
        *   @param {mask}
        *   @param {result}
        *   @returns {undefined}
        */
        Rectangle.clip = function(rect, mask, result) {
            if (typeof result === 'undefined') {
                result = new Rectangle();
            }

            result.x      = Math.min(Math.max(rect.x, mask.x), mask.x + mask.width);
            result.y      = Math.min(Math.max(rect.y, mask.y), mask.y + mask.height);
            result.width  = Math.max(Math.min(rect.x + rect.width, mask.x + mask.width), result.x) - result.x;
            result.height = Math.max(Math.min(rect.y + rect.height, mask.y + mask.height), result.y) - result.y;

            return result;
        };

        return Rectangle;
    }
);
