define([
        'math/vector3'
    ],
    function(
        Vector3
    ) {
        'use strict';

        var Ray = function(origin, direction) {
            this.origin    = origin || new Vector3();
            this.direction = direction || new Vector3();
        };

        Ray.prototype = {
            constructor: Ray,

            set: function(origin, direction) {
                this.origin.setFrom(origin);
                this.direction.setFrom(direction);
                return this;
            },

            setFrom: function(ray) {
                this.origin.setFrom(ray.origin);
                this.direction.setFrom(ray.direction);
                return this;
            },

            transform: function(matrix) {
                this.origin.transform(matrix);
                this.direction.transform(matrix);
                return this;
            },

            intersectBox: function(box) {
                return Ray.intersectBox(this, box);
            },

            intersectTriangle: function(a, b, c, backfaceCulling) {
                return Ray.intersectTriangle(this, a, b, c, backfaceCulling);
            },

            equals: function(ray) {
                return ((this.origin.equals(ray.origin)) 
                     && (this.direction.equals(ray.direction)));
            },

            clone: function() {
                return new Ray(this.origin.clone(), this.direction.clone());
            },

            isValid: function() {
                return !(isNaN(this.origin) || isNaN(this.direction));
            },

            toString: function() {
                return '{ origin: ' + this.origin.toString() 
                  + ', direction: ' + this.direction.toString + ' }';
            }
        };

        Ray.clone = function(ray) {
            return new Ray(ray.origin.clone(), ray.direction.clone());
        };

        /**
        *   This method returns the closest point at which this ray intersects
        *   the given bounding box. If no intersection is found, null is
        *   returned.
        *
        *   @method 
        *   @param {ray}
        *   @param {box}
        *   @returns {undefined}
        */
        Ray.intersectBox = function(ray, box) {
            // http://www.scratchapixel.com/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-box-intersection/
            var tmin,tmax,tymin,tymax,tzmin,tzmax;
            var invdirx = 1/ray.direction.x,
                invdiry = 1/ray.direction.y,
                invdirz = 1/ray.direction.z;

            var origin = ray.origin;
            if (invdirx >= 0) {
                tmin = (box.min.x - origin.x) * invdirx;
                tmax = (box.max.x - origin.x) * invdirx;
            } else { 
                tmin = (box.max.x - origin.x) * invdirx;
                tmax = (box.min.x - origin.x) * invdirx;
            }
            if (invdiry >= 0) {
                tymin = (box.min.y - origin.y) * invdiry;
                tymax = (box.max.y - origin.y) * invdiry;
            } else {
                tymin = (box.max.y - origin.y) * invdiry;
                tymax = (box.min.y - origin.y) * invdiry;
            }

            if ((tmin > tymax) || (tymin > tmax)) {
                return null;
            }

            // These lines also handle the case where tmin or tmax is NaN
            // (result of 0 * Infinity). x !== x returns true if x is NaN
            if (tymin > tmin || tmin !== tmin) { tmin = tymin; }
            if (tymax < tmax || tmax !== tmax) { tmax = tymax; }

            if (invdirz >= 0) {
                tzmin = (box.min.z - origin.z) * invdirz;
                tzmax = (box.max.z - origin.z) * invdirz;
            } else {
                tzmin = (box.max.z - origin.z) * invdirz;
                tzmax = (box.min.z - origin.z) * invdirz;
            }

            if ((tmin > tzmax) || (tzmin > tmax)) {
                return null;
            }

            if (tzmin > tmin || tmin !== tmin) { tmin = tzmin; }
            if (tzmax < tmax || tmax !== tmax) { tmax = tzmax; }

            if ( tmax < 0) {
                return null;
            }

            var result = new Vector3();

            // return point closest to the ray (positive side)
            return result.setFrom(ray.direction)
                         .multiplyScalar(tmin >= 0 ? tmin : tmax)
                         .add(ray.origin);
        };

        /**
        *   This method returns the point at which this ray intersects the
        *   triangle given by vectors a, b, and c. If no intersection is found
        *   null is returned.
        *
        *   @method 
        *   @param {ray}
        *   @param {a}
        *   @param {b}
        *   @param {c}
        *   @param {backfaceCulling}
        *   @returns {undefined}
        */
        Ray.intersectTriangle = (function() {
            // Cache vector objects used in calculation
            var diff   = new Vector3();
            var edge1  = new Vector3();
            var edge2  = new Vector3();
            var normal = new Vector3();

            return function (ray, a, b, c, backfaceCulling) {

                // from http://www.geometrictools.com/LibMathematics/Intersection/Wm5IntrRay3Triangle3.cpp

                // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
                // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
                //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
                //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
                //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)

                Vector3.subtract(b, a, edge1);
                Vector3.subtract(c, a, edge2);
                Vector3.cross(edge1, edge2, normal);

                var DdN = Vector3.dot(ray.direction, normal);
                var sign;

                if (DdN > 0) {
                    if (backfaceCulling) {
                        return null;
                    }
                    sign = 1;
                } else if (DdN < 0) {
                    sign = -1;
                    DdN  = -DdN;
                } else {
                    return null;
                }

                Vector3.subtract(ray.origin, a, diff);
                Vector3.cross(diff, edge2, edge2);

                var DdQxE2 = sign * Vector3.dot(ray.direction, edge2);

                // b1 < 0, no intersection
                if (DdQxE2 < 0) {
                    return null;
                }

                Vector3.cross(edge1, diff, edge1);

                var DdE1xQ = sign * Vector3.dot(ray.direction, edge1);

                // b2 < 0, no intersection
                if (DdE1xQ < 0) {
                    return null;
                }

                // b1+b2 > 1, no intersection
                if (DdQxE2 + DdE1xQ > DdN) {
                    return null;
                }

                // Line intersects triangle, check if ray does.
                var QdN = -sign * Vector3.dot(diff, normal);

                // t < 0, no intersection
                if (QdN < 0) {
                    return null;
                }

                var result = new Vector3();

                // Ray intersects triangle.
                return result.setFrom(ray.direction)
                             .multiplyScalar(QdN / DdN)
                             .add(ray.origin);
            };
        })();

        return Ray;
    }
);
