define([
        'core/component',
        'math/matrix4'
    ],
    function(
        Component,
        Matrix4
    ) {

        var Projection = function(width, height, near, far, fov) {
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

            this._projectionMatrix = new Matrix4();
            this._dirty = true;
        };

        Projection.__name__ = "Projection";

        Projection.prototype = Object.create(Component.prototype);

        Projection.prototype.constructor = Projection;

        Projection.prototype.isOrthographic = function() {
            return this.ortho; 
        };

        return Projection;
    }
);
