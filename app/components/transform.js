define([
        'lodash',
        'core/component',
        'math/vector3',
        'math/quaternion',
        'math/matrix4'
    ],
    function(
        _,
        Component,
        Vector3,
        Quaternion,
        Matrix4
    ) {
        'use strict';

        var Transform = function(position, scale, rotation) {
            Component.call(this);

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

        Transform.prototype = _.create(Component.prototype, {
            constructor: Transform,

            update: function() {
                var entity = this.getEntity();
                var transform, parent = entity.getParent();
                if (this.isDirty()) {
                    this._localMatrix.compose(this.localPosition, this.localRotation, this.localScale);

                    // TODO: not all entities have transforms, this method needs to account for that
                    if (parent && parent.hasComponent(Transform)) {
                        transform = parent.getComponent(Transform);
                        transform.update();
                        Matrix4.multiply(this._localMatrix, transform._worldMatrix, /*out*/ this._worldMatrix);
                    } else {
                        this._worldMatrix.copy(this._localMatrix);
                    }

                    this._worldMatrix.decompose(this._position, this._rotation, this._scale);
                    this.setDirty(false);
                }
            },

            getPosition: function() {
                if (this.isDirty()) { this.update(); }
                return this._position;
            },

            getRotation: function() {
                if (this.isDirty()) { this.update(); }
                return this._rotation;
            },

            getScale: function() {
                if (this.isDirty()) { this.update(); }
                return this._scale;
            },

            getWorldMatrix: function() {
                if (this.isDirty()) { this.update(); }
                return this._worldMatrix;
            },

            getLocalMatrix: function() {
                if (this.isDirty()) { this.update(); }
                return this._localMatrix;
            }
        });

        return Transform;
    }
);
