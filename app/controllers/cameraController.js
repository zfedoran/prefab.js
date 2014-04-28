define([
        'lodash',
        'math/matrix4',
        'math/vector3',
        'core/controller'
    ],
    function(
        _,
        Matrix4,
        Vector3,
        Controller
    ) {
        'use strict';

        /**
        *   This class updates the camera view and projection matrices for
        *   entities which have an associated camera component.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var CameraController = function(context) {
            Controller.call(this, context);
        };

        CameraController.prototype = _.create(Controller.prototype, {
            constructor: CameraController,

            /**
            *   Find all camera entities and update their view and projection
            *   matrices.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'Camera'], function(entity) {
                    this.updateProjectionMatrix(entity);
                    this.updateViewMatrix(entity);
                }, this);
            },

            /**
            *   Update the projection matrix associated with the provided
            *   camera entity.
            *
            *   @method updateProjectionMatrix
            *   @param {entity}
            *   @returns {undefined}
            */
            updateProjectionMatrix: function(entity) {
                var camera = entity.getComponent('Camera');

                if (camera.isDirty()) {
                    camera.aspect = camera.viewRect.width / camera.viewRect.height;
                    if (camera.isOrthographic()) {
                        if (camera.isOffCenter()) {
                            Matrix4.createOrthographic(0, camera.viewRect.width, 0, camera.viewRect.height, camera.near, camera.far, /*out*/ camera._projectionMatrix);
                        } else {
                            var width, height;
                            if (typeof camera.fov !== 'undefined') {
                                // Get target depth
                                var transform = entity.getComponent('Transform');
                                var vector = new Vector3();
                                Vector3.subtract(transform.getPosition(), camera.getTargetPosition(), /*out*/ vector);
                                var objectDepth = vector.length();

                                // Get perspective width/height
                                var ymax = Math.tan(camera.fov * Math.PI / 360);
                                var xmax = ymax * camera.aspect;
                                width = objectDepth * xmax;
                                height = objectDepth * ymax;
                            } else {
                                width = camera.viewRect.width;
                                height = camera.viewRect.height;
                            }

                            Matrix4.createOrthographic(-width, width, -height, height, camera.near, camera.far, /*out*/ camera._projectionMatrix);

                        }
                    } else {
                        Matrix4.createPerspective(camera.fov, camera.aspect, camera.near, camera.far, /*out*/ camera._projectionMatrix);
                    }
                }
            },

            /**
            *   Update the view matrix associated with the provided camera
            *   entity.
            *
            *   @method updateViewMatrix
            *   @param {entity}
            *   @returns {undefined}
            */
            updateViewMatrix: function(entity) {
                var camera = entity.getComponent('Camera');
                var transform = entity.getComponent('Transform');

                if (camera.isDirty()) {
                    if (camera.hasTarget()) {
                        Matrix4.createLookAt(transform.getPosition(), camera.getTargetPosition(), camera.up, /*out*/ camera._viewMatrix);
                    } else {
                        // If you only have the camera transformation and you want
                        // to compute the view matrix that will correctly transform
                        // vertices from world-space to view-space, you only need 
                        // to take the inverse of the camera transform.
                        Matrix4.inverse(transform.getWorldMatrix(), camera._viewMatrix);
                    }
                }
            }

        });

        return CameraController;
    }
);
