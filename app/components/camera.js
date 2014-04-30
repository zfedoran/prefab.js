define([
        'lodash',
        'core/entity',
        'core/component',
        'math/vector3',
        'math/matrix4'
    ],
    function(
        _,
        Entity,
        Component,
        Vector3,
        Matrix4
    ) {
        'use strict';

        var Camera = function(rect, near, far, fov, target, up) {
            Component.call(this);

            this.viewRect = rect;
            this.near = typeof near !== 'undefined' ? near : 0.1;
            this.far = typeof far !== 'undefined' ? far : 100;
            this.offCenter = false;

            if (typeof fov !== 'undefined') {
                this.fov = fov;
                this.ortho = false;
            } else {
                this.ortho = true;
            }

            this.target = target;
            this.up = typeof up !== 'undefined' ? up : Vector3.UP;

            this._viewMatrix = new Matrix4();
            this._projectionMatrix = new Matrix4();

            this.renderGroups = [];

            this._dirty = true;
        };

        Camera.__name__ = 'Camera';

        Camera.prototype = _.create(Component.prototype, {
            constructor: Camera,

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
            }
        });


        return Camera;
    }
);
