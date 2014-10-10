define([
        'lodash',
        'core/component',
        'math/vector3',
        'math/quaternion',
        'math/matrix4',
        'math/boundingBox'
    ],
    function(
        _,
        Component,
        Vector3,
        Quaternion,
        Matrix4,
        BoundingBox
    ) {
        'use strict';

        /**
        *   The Transform component class.
        *
        *   @class 
        *   @constructor
        *   @param {position}
        *   @param {scale}
        *   @param {rotation}
        */
        var Transform = function(position, scale, rotation) {
            Component.call(this);

            // Local transformations
            this.localPosition    = position || new Vector3();
            this.localScale       = scale    || new Vector3(1,1,1);
            this.localRotation    = rotation || new Quaternion();

            // Cached world transform values
            this._position        = new Vector3();
            this._scale           = new Vector3();
            this._rotation        = new Quaternion();

            // Cached matrix values
            this._worldMatrix     = new Matrix4();
            this._localMatrix     = new Matrix4();
        };

        Transform.__name__ = 'Transform';

        Transform.prototype = _.create(Component.prototype, {
            constructor: Transform,

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

            /**
            *   This method sets the dirty flag on this transform and all child
            *   transforms. Overrides the default setDirty method.
            *
            *   @method setDirty
            *   @param {value}
            *   @returns {undefined}
            */
            setDirty: function(value) {
                this._dirty = value;

                // If the current transform is dirty
                if (this._dirty) {
                    var entity = this.getEntity();
                    if (entity) {
                        // Set all child transforms to dirty
                        var i, len = entity.children.length;
                        for (i = 0; i < len; i++) {
                            var childEntity    = entity.children[i];
                            var childTransform = childEntity.getComponent(Transform);

                            // Only if the child transform is not already dirty.
                            if (childTransform && childTransform.isDirty()) {
                                childTransform.setDirty(value);
                            }
                        }
                    }
                }
            },

            /**
            *   Set the local position and mark the transform as dirty.
            *
            *   @method setPosition
            *   @param {x}
            *   @param {y}
            *   @param {z}
            *   @returns {undefined}
            */
            setPosition: function(x, y, z) {
                x = typeof x !== 'undefined' ? x : 0;
                y = typeof y !== 'undefined' ? y : 0;
                z = typeof z !== 'undefined' ? z : 0;

                this.localPosition.x = x;
                this.localPosition.y = y;
                this.localPosition.z = z;
                this.setDirty(true);
            },

            /**
            *   Set the local rotation using Euler angles with the order 'XYZ'
            *   and mark the transform as dirty.
            *
            *   @method setPosition
            *   @param {x}
            *   @param {y}
            *   @param {z}
            *   @returns {undefined}
            */
            setRotationFromEuler: (function() {
                var c1, c2, c3, s1, s2, s3;
                return function(x, y, z) {
                    x = typeof x !== 'undefined' ? x : 0;
                    y = typeof y !== 'undefined' ? y : 0;
                    z = typeof z !== 'undefined' ? z : 0;
                    
                    c1 = Math.cos(x / 2);
                    c2 = Math.cos(y / 2);
                    c3 = Math.cos(z / 2);
                    s1 = Math.sin(x / 2);
                    s2 = Math.sin(y / 2);
                    s3 = Math.sin(z / 2);

                    this.localRotation.x = c1 * s2 * c3 - s1 * c2 * s3;
                    this.localRotation.y = s1 * c2 * c3 + c1 * s2 * s3;
                    this.localRotation.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.localRotation.w = c1 * c2 * c3 - s1 * s2 * s3;

                    this.setDirty(true);
                };
            })(),

            /**
            *   Set the local scale and mark this transform dirty.
            *
            *   @method setScale
            *   @param {x}
            *   @param {y}
            *   @param {z}
            *   @returns {undefined}
            */
            setScale: function(x, y, z) {
                x = typeof x !== 'undefined' ? x : 1;
                y = typeof y !== 'undefined' ? y : 1;
                z = typeof z !== 'undefined' ? z : 1;

                this.localScale.x = x;
                this.localScale.y = y;
                this.localScale.z = z;
                this.setDirty(true);
            },

            /**
            *   Get the world position.
            *
            *   @method getPosition
            *   @returns {Vector3}
            */
            getWorldPosition: function() {
                if (this.isDirty()) { this.getWorldMatrix(); }
                return this._position;
            },

            /**
            *   Get the world rotation.
            *
            *   @method getRotation
            *   @returns {Quaternion}
            */
            getWorldRotation: function() {
                if (this.isDirty()) { this.getWorldMatrix(); }
                return this._rotation;
            },

            /**
            *   Get the world scale.
            *
            *   @method getScale
            *   @returns {Vector3}
            */
            getWorldScale: function() {
                if (this.isDirty()) { this.getWorldMatrix(); }
                return this._scale;
            },

            /**
            *   Get the world transform matrix.
            *
            *   @method getWorldMatrix
            *   @returns {undefined}
            */
            getWorldMatrix: function() {
                if (this.isDirty()) {
                    var entity = this.getEntity();

                    if (entity) {
                        var parentEntity = entity.getParent();

                        // Create a local transform matrix using the loacl position, rotation, and scale values
                        this._localMatrix.compose(this.localPosition, this.localRotation, this.localScale);

                        // If this entity has a parent entity
                        var foundParentWithTransform = false;
                        if (parentEntity) {
                            var parentTransform = parentEntity.getComponent(Transform);

                            // And that entity has a transform component
                            if (parentTransform) {
                                foundParentWithTransform = true;

                                // Get the parent world transform matrix
                                var parentMatrix = parentTransform.getWorldMatrix();

                                // Apply the parent transformations to the local transforms
                                Matrix4.multiply(parentMatrix, this._localMatrix, /*out*/ this._worldMatrix);
                            }
                        } 

                        // Use the local transforms as the world transforms
                        if (!foundParentWithTransform) {
                            this._worldMatrix.setFrom(this._localMatrix);
                        }

                        // Set the world position, rotation, and scale (cached) values
                        this._worldMatrix.decompose(this._position, this._rotation, this._scale);
                    }

                    this.setDirty(false);
                }

                return this._worldMatrix;
            },

            /**
            *   Get the local transform matrix.
            *
            *   @method getLocalMatrix
            *   @returns {undefined}
            */
            getLocalMatrix: function() {
                if (this.isDirty()) { this.getWorldMatrix(); }
                return this._localMatrix;
            }
        });

        return Transform;
    }
);
