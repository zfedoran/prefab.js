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
                    var width     = camera.viewRect.width;
                    var height    = camera.viewRect.height;
                    camera.aspect = camera.viewRect.width / camera.viewRect.height;

                    if (camera.isPerspective()) {
                        // Perspective Camera
                        Matrix4.createPerspective(camera.fov, camera.aspect, camera.near, camera.far, /*out*/ camera._projectionMatrix);

                    } else if (camera.isOrthographicWithFOV()) {
                        // Get the target depth
                        var transform = entity.getComponent('Transform');
                        var depth     = Vector3.subtract(transform.getPosition(), camera.getTargetPosition()).length();

                        // Get perspective width/height
                        var ymax = Math.tan(camera.fov * Math.PI / 360);
                        var xmax = ymax * camera.aspect;
                        var w    = depth * xmax;
                        var h    = depth * ymax;

                        // Complex Ortho Camera with FoV (calculated using fov + target depth)
                        Matrix4.createOrthographic(-w, w, -h, h, camera.near, camera.far, /*out*/ camera._projectionMatrix);

                    } else if (camera.isOrthographic()) {
                        // Simple Ortho Camera
                        if (camera.isOffCenter()) {
                            Matrix4.createOrthographic(0, width, 0, height, camera.near, camera.far, /*out*/ camera._projectionMatrix);
                        } else {
                            var hw = width * 0.5;
                            var hh = height * 0.5;
                            Matrix4.createOrthographic(-hw, hw, -hh, hh, camera.near, camera.far, /*out*/ camera._projectionMatrix);
                        }
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
                        Matrix4.createLookAt(transform.getWorldPosition(), camera.getTargetPosition(), camera.up, /*out*/ camera._viewMatrix);
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
