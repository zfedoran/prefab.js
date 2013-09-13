define([
    ],
    function(
    ) {

        var Vector4 = function(x, y, z, w) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        };

        Vector4.prototype = {
            constructor: Vector4,

            set: function(x, y, z, w) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
                this.w = w || 0;
                return this;
            },

            length: function() {
                return Math.sqrt( this.x * this.x 
                                + this.y * this.y
                                + this.z * this.z
                                + this.w * this.w );
            },

            lengthSquared: function() {
                return this.x * this.x 
                     + this.y * this.y
                     + this.z * this.z
                     + this.w * this.w;
            },

            normalize: function() {
                var length = this.length();
                this.x = this.x / length;
                this.y = this.y / length;
                this.z = this.z / length;
                this.w = this.w / length;
                return this;
            },

            transform: function(matrix) {
                var e = matrix.elements;
                var x = this.x; var y = this.y; var z = this.z; var w = this.w;

                this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
                this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
                this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
                this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

                return this;
            },

            equals: function(v) {
                return ((v.x === this.x)
                     && (v.y === this.y)
                     && (v.z === this.z)
                     && (v.w === this.w));
            },

            clone: function() {
                return new Vector4(this.x, this.y, this.z, this.w);
            },

            isValid: function() {
                return !(isNaN(this.x) 
                      || isNaN(this.y)
                      || isNaN(this.z)
                      || isNaN(this.w));
            },

            toArray: function() {
                return [this.x, this.y, this.z, this.w];
            },

            toString: function() {
                return '[ ' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ' ]';
            }
        };

        Vector4.clone = function(vector) {
            return new Vector4(vector.x, vector.y, vector.z, vector.w);
        };

        Vector4.add = function(a, b, result) {
            result.x = a.x + b.x;
            result.y = a.y + b.y;
            result.z = a.z + b.z;
            result.w = a.w + b.w;
        };

        Vector4.subtract = function(a, b, result) {
            result.x = a.x - b.x;
            result.y = a.y - b.y;
            result.z = a.z - b.z;
            result.w = a.w - b.w;
        };

        Vector4.multiply = function(a, b, result) {
            result.x = a.x * b.x;
            result.y = a.y * b.y;
            result.z = a.z * b.z;
            result.w = a.w * b.w;
        };

        Vector4.divide = function(a, b, result) {
            result.x = a.x / b.x;
            result.y = a.y / b.y;
            result.z = a.z / b.z;
            result.w = a.w / b.w;
        };

        Vector4.addScalar = function(v, s, result) {
            result.x = v.x + s;
            result.y = v.y + s;
            result.z = v.z + s;
            result.w = v.w + s;
        };

        Vector4.subtractScalar = function(v, s, result) {
            result.x = v.x - s;
            result.y = v.y - s;
            result.z = v.z - s;
            result.w = v.w - s;
        };

        Vector4.multiplyScalar = function(v, s, result) {
            result.x = v.x * s;
            result.y = v.y * s;
            result.z = v.z * s;
            result.w = v.w * s;
        };

        Vector4.divideScalar = function(v, s, result) {
            result.x = v.x / s;
            result.y = v.y / s;
            result.z = v.z / s;
            result.w = v.w / s;
        };

        Vector4.min = function(a, b, result) {
            if (a.x < b.x) {
                result.x = a.x;
            }
            if (a.y < b.y) {
                result.y = a.y;
            }
            if (a.z < b.z) {
                result.z = a.z;
            }
            if (a.w < b.w) {
                result.w = a.w;
            }
        };

        Vector4.max = function(a, b, result) {
            if (a.x > b.x) {
                result.x = a.x;
            }
            if (a.y > b.y) {
                result.y = a.y;
            }
            if (a.z > b.z) {
                result.z = a.z;
            }
            if (a.w > b.w) {
                result.w = a.w;
            }
        };

        Vector4.clamp = function(min, max, val, result) {
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
            if ( val.w < min.w ) {
                result.w = min.w;
            } else if ( val.w > max.w ) {
                result.w = max.w;
            }
        };

        Vector4.dot = function(a, b) {
            return a.x * b.x 
                 + a.y * b.y
                 + a.z * b.z
                 + a.w * b.w;
        };

        Vector4.cross = function(a, b, result) {
            result.x = a.y * b.z - a.z * b.y;
            result.y = a.z * b.x - a.x * b.z;
            result.z = a.x * b.y - a.y * b.x;
        };

        Vector4.lerp = function(a, b, amount, result) {
            result.x = a.x + ( b.x - a.x ) * amount;
            result.y = a.y + ( b.y - a.y ) * amount;
            result.z = a.z + ( b.z - a.z ) * amount;
            result.w = a.w + ( b.w - a.w ) * amount;
        };

        Vector4.distanceSquared = function(a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            var dz = a.z - b.z;
            var dw = a.w - b.w;
            return dx * dx 
                 + dy * dy
                 + dz * dz
                 + dw * dw;
        };

        Vector4.distance = function(a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            var dz = a.z - b.z;
            var dw = a.w - b.w;
            return Math.sqrt(dx * dx 
                           + dy * dy
                           + dz * dz
                           + dw * dw);
        };

        return Vector4;
    }
);
