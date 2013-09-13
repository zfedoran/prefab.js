define([
    ],
    function(
    ) {

        var Quaternion = function(x, y, z, w) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = (w !== undefined) ? w : 1;
        };

        Quaternion.prototype = {
            constructor: Quaternion,

            set: function(x, y, z, w) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
                this.w = (w !== undefined) ? w : 1;
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

            equals: function(q) {
                return ((q.x === this.x)
                     && (q.y === this.y)
                     && (q.z === this.z)
                     && (q.w === this.w));
            },

            clone: function() {
                return new Quaternion(this.x, this.y, this.z, this.w);
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

        Quaternion.clone = function(q) {
            return new Quaternion(q.x, q.y, q.z, q.w);
        };

        Quaternion.add = function(a, b, result) {
            result.x = a.x + b.x;
            result.y = a.y + b.y;
            result.z = a.z + b.z;
            result.w = a.w + b.w;
        };

        Quaternion.subtract = function(a, b, result) {
            result.x = a.x - b.x;
            result.y = a.y - b.y;
            result.z = a.z - b.z;
            result.w = a.w - b.w;
        };

        Quaternion.multiply = function(a, b, result) {
            result.x = a.x * b.x;
            result.y = a.y * b.y;
            result.z = a.z * b.z;
            result.w = a.w * b.w;
        };

        Quaternion.divide = function(a, b, result) {
            result.x = a.x / b.x;
            result.y = a.y / b.y;
            result.z = a.z / b.z;
            result.w = a.w / b.w;
        };

        Quaternion.addScalar = function(q, s, result) {
            result.x = q.x + s;
            result.y = q.y + s;
            result.z = q.z + s;
            result.w = q.w + s;
        };

        Quaternion.subtractScalar = function(q, s, result) {
            result.x = q.x - s;
            result.y = q.y - s;
            result.z = q.z - s;
            result.w = q.w - s;
        };

        Quaternion.multiplyScalar = function(q, s, result) {
            result.x = q.x * s;
            result.y = q.y * s;
            result.z = q.z * s;
            result.w = q.w * s;
        };

        Quaternion.divideScalar = function(q, s, result) {
            result.x = q.x / s;
            result.y = q.y / s;
            result.z = q.z / s;
            result.w = q.w / s;
        };

        Quaternion.dot = function(a, b) {
            return a.x * b.x 
                 + a.y * b.y
                 + a.z * b.z
                 + a.w * b.w;
        };

        Quaternion.lerp = function(a, b, amount, result) {
            result.x = a.x + ( b.x - a.x ) * amount;
            result.y = a.y + ( b.y - a.y ) * amount;
            result.z = a.z + ( b.z - a.z ) * amount;
            result.w = a.w + ( b.w - a.w ) * amount;
        };

        Quaternion.distanceSquared = function(a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            var dz = a.z - b.z;
            var dw = a.w - b.w;
            return dx * dx 
                 + dy * dy
                 + dz * dz
                 + dw * dw;
        };

        Quaternion.distance = function(a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            var dz = a.z - b.z;
            var dw = a.w - b.w;
            return Math.sqrt(dx * dx 
                           + dy * dy
                           + dz * dz
                           + dw * dw);
        };

        Quaternion.createFromRotationMatrix = function(m, result) {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
            var te = m.elements;
            var m11 = te[0], m12 = te[4], m13 = te[8];
            var m21 = te[1], m22 = te[5], m23 = te[9];
            var m31 = te[2], m32 = te[6], m33 = te[10];
            var trace = m11 + m22 + m33;
            var s;

            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1.0);
                result.w = 0.25 / s;
                result.x = (m32 - m23) * s;
                result.y = (m13 - m31) * s;
                result.z = (m21 - m12) * s;
            } else if (m11 > m22 && m11 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
                result.w = (m32 - m23) / s;
                result.x = 0.25 * s;
                result.y = (m12 + m21) / s;
                result.z = (m13 + m31) / s;
            } else if (m22 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
                result.w = (m13 - m31) / s;
                result.x = (m12 + m21) / s;
                result.y = 0.25 * s;
                result.z = (m23 + m32) / s;
            } else {
                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
                result.w = (m21 - m12) / s;
                result.x = (m13 + m31) / s;
                result.y = (m23 + m32) / s;
                result.z = 0.25 * s;
            }
        };

        return Quaternion;
    }
);
