define([
        'core/component',
        'math/vector3',
        'math/quaternion',
        'math/matrix4'
    ],
    function(
        Component,
        Vector3,
        Quaternion,
        Matrix4
    ) {

        var Transform = function(position, scale, rotation) {
            Component.call(this);

            this.parent = null;
            this.children = [];

            this.localPosition = position || new Vector3();
            this.localScale = scale || new Vector3(1,1,1);
            this.localRotation = rotation || new Quaternion();

            this._position = new Vector3();
            this._scale = new Vector3();
            this._rotation = new Quaternion();

            this._worldMatrix = new Matrix4();
            this._localMatrix = new Matrix4();
        };

        Transform.__name__ = 'Transform';

        Transform.prototype = Object.create(Component.prototype);

        Transform.prototype.constructor = Transform;

        Transform.prototype.update = function() {
            var transform, parent = this.parent;
            if (this.isDirty()) {
                this._localMatrix.compose(this.localPosition, this.localRotation, this.localScale);

                if (parent) {
                    transform = parent.getComponent(Transform);
                    transform.update();
                    Matrix4.multiply(this._localMatrix, transform._worldMatrix, /*out*/ this._worldMatrix);
                } else {
                    this._worldMatrix.copy(this._localMatrix);
                }

                this._worldMatrix.decompose(this._position, this._rotation, this._scale);
                this.setDirty(false);
            }
        };

        Transform.prototype.getPosition = function() {
            if (this.isDirty()) { this.update(); }
            return this._position;
        };

        Transform.prototype.getRotation = function() {
            if (this.isDirty()) { this.update(); }
            return this._rotation;
        };

        Transform.prototype.getScale = function() {
            if (this.isDirty()) { this.update(); }
            return this._scale;
        };

        Transform.prototype.getWorldMatrix = function() {
            if (this.isDirty()) { this.update(); }
            return this._worldMatrix;
        };

        Transform.prototype.getLocalMatrix = function() {
            if (this.isDirty()) { this.update(); }
            return this._localMatrix;
        };

        return Transform;
    }
);
