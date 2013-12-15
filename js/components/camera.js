define([
        'core/entity',
        'core/component',
        'math/vector3',
        'math/matrix4'
    ],
    function(
        Entity,
        Component,
        Vector3,
        Matrix4
    ) {
        'use strict';

        var Camera = function(width, height, near, far, fov, target, up) {
            Component.call(this);

            this.width = width;
            this.height = height;
            this.near = typeof near !== 'undefined' ? near : 0.1;
            this.far = typeof far !== 'undefined' ? far : 100;

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

        Camera.prototype = Object.create(Component.prototype);

        Camera.prototype.constructor = Camera;

        Camera.prototype.containsRenderGroup = function(name) {
            var i, group;
            for (i = 0; i < this.renderGroups.length; i++) {
                group = this.renderGroups[i];
                if (group === 'name') {
                    return true;
                }
            }
            return false;
        };

        Camera.prototype.removeRenderGroup = function(name) {
            var i, group, newGroupList = [];
            for (i = 0; i < this.renderGroups.length; i++) {
                group = this.renderGroups[i];
                if (group !== 'name') {
                    newGroupList.push(group);
                }
            }
            this.renderGroups = newGroupList;
        };

        Camera.prototype.addRenderGroup = function(name) {
            if (!this.containsRenderGroup()) {
                this.renderGroups.push(name); 
            }
        };

        Camera.prototype.isOrthographic = function() {
            return this.ortho; 
        };

        Camera.prototype.hasTarget = function() {
            return this.target instanceof Vector3 || this.target instanceof Entity;
        };

        Camera.prototype.getTargetPosition = function() {
            if (this.target instanceof Vector3) {
                return this.target;
            } 

            var transform;
            if (this.target instanceof Entity) {
                transform = this.target.getComponent('Transform');
                if (transform) {
                    return transform.getPosition();
                } 
                throw 'Camera: Target entity has no transform component.';
            } 
            throw 'Camera: Unsupported view target type.';
        };

        return Camera;
    }
);
