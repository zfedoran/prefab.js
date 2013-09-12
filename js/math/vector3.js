define([
    ],
    function(
    ) {

        var Vector3 = function(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        };

        Vector3.prototype = {
            constructor: Vector3,

            length: function () {
                return Math.sqrt( this.x * this.x 
                                + this.y * this.y
                                + this.z * this.z );
            },

            lengthSquared: function () {
                return this.x * this.x 
                     + this.y * this.y
                     + this.z * this.z;
            },

            normalize: function () {
                var length = this.length();
                this.x = this.x / length;
                this.y = this.y / length;
                this.z = this.z / length;
            },

            equals: function( v ) {
                return (( v.x === this.x ) 
                     && ( v.y === this.y )
                     && ( v.z === this.z ));
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
            result.x = a.x + b.x;
            result.y = a.y + b.y;
            result.z = a.z + b.z;
        };

        Vector3.subtract = function(a, b, result) {
            result.x = a.x - b.x;
            result.y = a.y - b.y;
            result.z = a.z - b.z;
        };

        Vector3.multiply = function(a, b, result) {
            result.x = a.x * b.x;
            result.y = a.y * b.y;
            result.z = a.z * b.z;
        };

        Vector3.divide = function(a, b, result) {
            result.x = a.x / b.x;
            result.y = a.y / b.y;
            result.z = a.z / b.z;
        };

        Vector3.addScalar = function(v, s, result) {
            result.x = v.x + s;
            result.y = v.y + s;
            result.z = v.z + s;
        };

        Vector3.subtractScalar = function(v, s, result) {
            result.x = a.x - s;
            result.y = a.y - s;
            result.z = a.z - s;
        };

        Vector3.multiplyScalar = function(v, s, result) {
            result.x = a.x * s;
            result.y = a.y * s;
            result.z = a.z * s;
        };

        Vector3.divideScalar = function(v, s, result) {
            result.x = a.x / s;
            result.y = a.y / s;
            result.z = a.z / s;
        };

        Vector3.min = function(a, b, result) {
            if (a.x < b.x) {
                result.x = a.x;
            }
            if (a.y < b.y) {
                result.y = a.y;
            }
            if (a.z < b.z) {
                result.z = a.z;
            }
        };

        Vector3.max = function(a, b, result) {
            if (a.x > b.x) {
                result.x = a.x;
            }
            if (a.y > b.y) {
                result.y = a.y;
            }
            if (a.z > b.z) {
                result.z = a.z;
            }
        };

        Vector3.clamp = function(min, max, val, result) {
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
        };

        Vector3.dot = function(a, b) {
            return a.x * b.x 
                 + a.y * b.y
                 + a.z * b.z;
        };

        Vector3.cross = function(a, b, result) {
            result.x = a.y * b.z - a.z * b.y;
            result.y = a.z * b.x - a.x * b.z;
            result.z = a.x * b.y - a.y * b.x;
        };

        Vector3.lerp = function(a, b, amount, result) {
            result.x = a.x + ( b.x - a.x ) * amount;
            result.y = a.y + ( b.y - a.y ) * amount;
            result.z = a.z + ( b.z - a.z ) * amount;
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

        return Vector3;
    }
);
