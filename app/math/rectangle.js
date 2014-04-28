define([
    ],
    function(
    ) {
        'use strict';

        var Rectangle = function(x, y, width, height) {
            this.x = x || 0;
            this.y = y || 0;
            this.width = width || 0;
            this.height = height || 0;
        };

        Rectangle.prototype = {
            constructor: Rectangle,

            set: function(x, y, width, height) {
                this.x = x || 0;
                this.y = y || 0;
                this.width = width || 0;
                this.height = height || 0;
                return this;
            },

            equals: function( r ) {
                return ((r.x === this.x) 
                     && (r.y === this.y)
                     && (r.width === this.width)
                     && (r.height === this.height));
            },

            clone: function() {
                return new Rectangle(this.x, this.y);
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

        return Rectangle;
    }
);
