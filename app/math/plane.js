define([
        'math/vector3',
        'math/vector4',
        'math/matrix4'
    ],
    function(
        Vector3,
        Vector4,
        Matrix4
    ) {
        'use strict';

        var Plane = function(normal, distance) {
            // Plane normal
            this.normal   = normal || new Vector3();

            // Distance to the origin
            // (Note: points on the plane satisfy dot(this.normal, point) = distance)
            this.distance = typeof distance !== 'undefined' ? distance : 0;
        };

        Plane.prototype = {
            constructor: Plane,

            set: function(normal, distance) {
                this.normal.setFrom(normal);
                this.distance = distance;
                return this;
            },

            setFrom: function(plane) {
                this.normal.setFrom(plane.normal);
                this.distance = plane.distance;
                return this;
            },

            setFromTriangle: function(pointA, pointB, pointC) {
                var ba = Vector3.subtract(pointB, pointA);
                var ca = Vector3.subtract(pointC, pointA);
                
                Vector3.cross(ba, ca, /*out*/ this.normal);
                this.normal.normalize();
                this.distance = Vector3.dot(this.normal, pointA);

                return this;
            },

            transform: (function() {
                var normal       = new Vector4();
                var point        = new Vector4();
                var normalMatrix = new Matrix4();

                return function(matrix) {
                    normal.setFrom(this.normal);
                    Vector3.multiplyScalar(this.normal, this.distance, point);

                    normal.w = 0;
                    point.w  = 1;

                    // Calculate the normal matrix
                    Matrix4.inverse(matrix, /*out*/ normalMatrix);
                    normalMatrix.transpose();

                    point.transform(matrix);
                    normal.transform(normalMatrix);
                    
                    this.normal.setFrom(normal);
                    this.distance = Vector3.dot(this.normal, point);
                };
            })(),

            intersectBox: function(box) {
                throw 'Plane: intersectBox() not implemented.';
            },

            intersectTriangle: function(a, b, c, backfaceCulling) {
                throw 'Plane: intersectTriangle() not implemented.';
            },

            intersectSegment: function(a, b, result) {
                return Plane.intersectSegmentPlane(a, b, this, result);
            },

            equals: function(plane) {
                return (this.normal.equals(plane.normal) 
                     && (this.distance === plane.distance));
            },

            clone: function() {
                return new Plane(this.normal.clone(), this.distance);
            },

            isValid: function() {
                return this.normal.isValid() && !isNaN(this.distance);
            },

            toString: function() {
                return '{ normal: ' + this.normal.toString() 
                  + ', distance: ' + this.distance.toString() + ' }';
            }
        };

        Plane.clone = function() {
            return new Plane(this.normal.clone(), this.distance);
        };

        Plane.createFromTriangle = function(pointA, pointB, pointC, result) {
            if (typeof result === 'undefined') {
                result = new Plane();
            }

            result.setFromTriangle(pointA, pointB, pointC);

            return result;
        };

        Plane.createFromPoint = function(point, normal, result) {
            if (typeof result === 'undefined') {
                result = new Plane();
            }

            result.set(normal, Vector3.dot(normal, point));

            return result;
        };

        Plane.intersectSegmentPlane = function(pointA, pointB, plane, result) {
            // Compute the t value for the directed line ab intersecting the plane
            var ab = Vector3.subtract(pointB, pointA);
            var t  = (plane.distance - Vector3.dot(plane.normal, pointA)) / Vector3.dot(plane.normal, ab);

            // Is the result required?
            if (typeof result !== 'undefined') {

                // If t in [0..1] compute and return intersection point
                if (t >= 0 && t <= 1) {
                    Vector3.multiplyScalar(ab, t, /*out*/ result);
                    Vector3.add(pointA, ab, /*out*/ result);
                }
            }

            return t;
        };

        return Plane;
    }
);
