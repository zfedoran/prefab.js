define([
    ],
    function(
    ) {
        'use strict';

        var Vector3 = function(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        };

        Vector3.prototype = {
            constructor: Vector3,

            set: function(x, y, z) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
                return this;
            },

            setFrom: function(vector) {
                this.x = vector.x;
                this.y = vector.y;
                this.z = vector.z;
                return this;
            },

            length: function() {
                return Math.sqrt( this.x * this.x 
                                + this.y * this.y
                                + this.z * this.z );
            },

            lengthSquared: function() {
                return this.x * this.x 
                     + this.y * this.y
                     + this.z * this.z;
            },

            normalize: function() {
                var length = this.length();
                this.x = this.x / length;
                this.y = this.y / length;
                this.z = this.z / length;
                return this;
            },

            transform: function(matrix) {
                var e = matrix.elements;
                var x = this.x, y = this.y, z = this.z;

                this.x = e[0] * x + e[4] * y + e[8]  * z + e[12];
                this.y = e[1] * x + e[5] * y + e[9]  * z + e[13];
                this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

                return this;
            },

            equals: function( v ) {
                return ((v.x === this.x)
                     && (v.y === this.y)
                     && (v.z === this.z));
            },

            clone: function() {
                return new Vector3(this.x, this.y, this.z);
            },

            isValid: function() {
                return !(isNaN(this.x) 
                      || isNaN(this.y)
                      || isNaN(this.z));
            },

            toArray: function() {
                return [this.x, this.y, this.z];
            },

            toString: function() {
                return '[ ' + this.x + ', ' + this.y + ', ' + this.z + ' ]';
            }
        };

        Vector3.clone = function(vector) {
            return new Vector3(vector.x, vector.y, vector.z);
        };

        Vector3.add = function(a, b, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = a.x + b.x;
            result.y = a.y + b.y;
            result.z = a.z + b.z;

            return result;
        };

        Vector3.subtract = function(a, b, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = a.x - b.x;
            result.y = a.y - b.y;
            result.z = a.z - b.z;

            return result;
        };

        Vector3.multiply = function(a, b, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = a.x * b.x;
            result.y = a.y * b.y;
            result.z = a.z * b.z;

            return result;
        };

        Vector3.divide = function(a, b, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = a.x / b.x;
            result.y = a.y / b.y;
            result.z = a.z / b.z;

            return result;
        };

        Vector3.addScalar = function(v, s, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = v.x + s;
            result.y = v.y + s;
            result.z = v.z + s;

            return result;
        };

        Vector3.subtractScalar = function(v, s, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = v.x - s;
            result.y = v.y - s;
            result.z = v.z - s;

            return result;
        };

        Vector3.multiplyScalar = function(v, s, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = v.x * s;
            result.y = v.y * s;
            result.z = v.z * s;

            return result;
        };

        Vector3.divideScalar = function(v, s, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = v.x / s;
            result.y = v.y / s;
            result.z = v.z / s;

            return result;
        };

        Vector3.min = function(a, b, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            if (a.x < b.x) {
                result.x = a.x;
            }
            if (a.y < b.y) {
                result.y = a.y;
            }
            if (a.z < b.z) {
                result.z = a.z;
            }

            return result;
        };

        Vector3.max = function(a, b, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            if (a.x > b.x) {
                result.x = a.x;
            }
            if (a.y > b.y) {
                result.y = a.y;
            }
            if (a.z > b.z) {
                result.z = a.z;
            }

            return result;
        };

        Vector3.clamp = function(min, max, val, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            if ( val.x < min.x ) {
                result.x = min.x;
            } else if ( val.x > max.x ) {
                result.x = max.x;
            }
            if ( val.y < min.y ) {
                result.y = min.y;
            } else if ( val.y > max.y ) {
                result.y = max.y;
            }
            if ( val.z < min.z ) {
                result.z = min.z;
            } else if ( val.z > max.z ) {
                result.z = max.z;
            }

            return result;
        };

        Vector3.dot = function(a, b) {
            return a.x * b.x 
                 + a.y * b.y
                 + a.z * b.z;
        };

        Vector3.cross = function(a, b, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = a.y * b.z - a.z * b.y;
            result.y = a.z * b.x - a.x * b.z;
            result.z = a.x * b.y - a.y * b.x;

            return result;
        };

        Vector3.lerp = function(a, b, amount, result) {
            if (typeof result === 'undefined') {
                result = new Vector3();
            }
            result.x = a.x + ( b.x - a.x ) * amount;
            result.y = a.y + ( b.y - a.y ) * amount;
            result.z = a.z + ( b.z - a.z ) * amount;

            return result;
        };

        Vector3.distanceSquared = function(a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            var dz = a.z - b.z;
            return dx * dx 
                 + dy * dy
                 + dz * dz;
        };

        Vector3.distance = function(a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            var dz = a.z - b.z;
            return Math.sqrt(dx * dx 
                           + dy * dy
                           + dz * dz);
        };

        Vector3.UP = new Vector3(0, 1, 0);
        Vector3.DOWN = new Vector3(0, -1, 0);

        Vector3.LEFT = new Vector3(1, 0, 0);
        Vector3.RIGHT = new Vector3(-1, 0, 0);

        Vector3.FORWARD = new Vector3(0, 0, -1);
        Vector3.BACK = new Vector3(0, 0, 1);

        return Vector3;
    }
);
