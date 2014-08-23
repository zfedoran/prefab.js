define([
        'lodash',
        'core/entity',
        'core/component',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'math/ray'
    ],
    function(
        _,
        Entity,
        Component,
        Vector3,
        Vector4,
        Matrix4,
        Ray
    ) {
        'use strict';

        var Camera = function(rect, near, far, fov, target, up) {
            Component.call(this);

            this.viewRect  = rect;
            this.near      = typeof near !== 'undefined' ? near : 0.1;
            this.far       = typeof far !== 'undefined' ? far : 100;
            this.fov       = fov;
            this.ortho     = typeof fov === 'undefined';
            this.offCenter = false;

            this.target = target;
            this.up     = typeof up !== 'undefined' ? up : Vector3.UP;

            this._viewMatrix       = new Matrix4();
            this._projectionMatrix = new Matrix4();

            this.renderGroups = [];

            this._dirty = true;
        };

        Camera.__name__ = 'Camera';

        Camera.prototype = _.create(Component.prototype, {
            constructor: Camera,

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

            containsRenderGroup: function(name) {
                var i, group;
                for (i = 0; i < this.renderGroups.length; i++) {
                    group = this.renderGroups[i];
                    if (group === 'name') {
                        return true;
                    }
                }
                return false;
            },

            removeRenderGroup: function(name) {
                var i, group, newGroupList = [];
                for (i = 0; i < this.renderGroups.length; i++) {
                    group = this.renderGroups[i];
                    if (group !== 'name') {
                        newGroupList.push(group);
                    }
                }
                this.renderGroups = newGroupList;
            },

            addRenderGroup: function(name) {
                if (!this.containsRenderGroup()) {
                    this.renderGroups.push(name); 
                }
            },

            isPerspective: function() {
                return !this.ortho;
            },

            isOrthographicWithFOV: function() {
                return this.ortho && this.fov;
            },

            isOrthographic: function() {
                return this.ortho; 
            },

            isOffCenter: function() {
                return this.offCenter; 
            },

            hasTarget: function() {
                return this.target instanceof Vector3 || this.target instanceof Entity;
            },

            getTargetPosition: function() {
                if (this.target instanceof Vector3) {
                    return this.target;
                } 

                var transform;
                if (this.target instanceof Entity) {
                    transform = this.target.getComponent('Transform');
                    if (transform) {
                        return transform.getWorldPosition();
                    } 
                    throw 'Camera: Target entity has no transform component.';
                } 
                throw 'Camera: Unsupported view target type.';
            },

            projectVector: function() {
                throw 'Camera: projectVector() function not implemented yet.';
            },

            /**
            *   This method takes a vector from screen space to world space.
            *
            *   @method unprojectVector
            *   @param {Vector3}
            *   @param {result}
            *   @returns {Vector3}
            */
            unprojectVector: function(vector, result) {
                if (typeof result === 'undefined') {
                    result = new Vector3();
                }

                var vec4   = new Vector4();
                var matrix = new Matrix4();

                vec4.setFrom(vector);

                Matrix4.multiply(this._projectionMatrix, this._viewMatrix, matrix);
                matrix.inverse();

                // Map x and y from window coordinates
                vec4.x = (vec4.x - this.viewRect.x) / this.viewRect.width;
                vec4.y = (vec4.y - this.viewRect.y) / this.viewRect.height;

                // Map to range -1 to 1
                vec4.x = vec4.x * 2 - 1;
                vec4.y = vec4.y * 2 - 1;
                vec4.z = vec4.z * 2 - 1;
                vec4.w = 1;

                vec4.transform(matrix);

                result.x = vec4.x / vec4.w;
                result.y = vec4.y / vec4.w;
                result.z = vec4.z / vec4.w;
                
                return result;
            },

            /**
            *   This method returns a Ray object representing the unprojected
            *   vector.
            *
            *   @method createPickingRay
            *   @param {vec2Pos}
            *   @param {result}
            *   @returns {undefined}
            */
            createPickingRay: (function() {
                var constStart = new Vector3();
                var constEnd   = new Vector3();

                return function(vec2Pos, result) {
                    constStart.set(vec2Pos.x, vec2Pos.y, 0.0);
                    constEnd.set(vec2Pos.x, vec2Pos.y, 1.0);

                    this.unprojectVector(constStart, /*out*/ constStart);
                    this.unprojectVector(constEnd, /*out*/ constEnd);

                    return Ray.createFromSegment(constStart, constEnd, result);
                };
            })()
        });


        return Camera;
    }
);
