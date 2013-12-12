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

        var View = function(target, up) {
            Component.call(this);

            this.target = target;
            this.up = typeof up !== 'undefined' ? up : Vector3.UP;

            this._viewMatrix = new Matrix4();
        };

        View.__name__ = 'View';

        View.prototype = Object.create(Component.prototype);

        View.prototype.constructor = View;

        View.prototype.hasTarget = function() {
            return this.target instanceof Vector3 || this.target instanceof Entity;
        };

        View.prototype.getTargetPosition = function() {
            if (this.target instanceof Vector3) {
                return this.target;
            } 

            var transform;
            if (this.target instanceof Entity) {
                transform = this.target.getComponent('Transform');
                if (transform) {
                    return transform.getPosition();
                } 
                throw 'View: Target entity has no transform component.';
            } 
            throw 'View: Unsupported view target type.';
        };


        return View;
    }
);
