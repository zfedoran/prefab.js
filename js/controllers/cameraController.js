define([
        'lodash',
        'math/matrix4',
        'core/controller'
    ],
    function(
        _,
        Matrix4,
        Controller
    ) {
        'use strict';

        var CameraController = function(context) {
            Controller.call(this, context, ['Transform', 'Camera']);
        };

        CameraController.prototype = _.extend(Object.create(Controller.prototype), {
            constructor: CameraController,

            updateProjectionMatrix: function(entity) {
                var camera = entity.getComponent('Camera');

                if (camera.isDirty()) {
                    camera.aspect = camera.width / camera.height;
                    if (camera.isOrthographic()) {
                        if (camera.isOffCenter()) {
                            Matrix4.createOrthographic(
                                0, 
                                camera.width, 
                                0, 
                                camera.height, 
                                camera.near, 
                                camera.far, 
                        /*out*/ camera._projectionMatrix);
                        } else {
                            Matrix4.createOrthographic(
                               -camera.width/35, 
                                camera.width/35, 
                               -camera.height/35, 
                                camera.height/35, 
                                camera.near, 
                                camera.far, 
                        /*out*/ camera._projectionMatrix);
                        }
                    } else {
                        Matrix4.createPerspective(
                            camera.fov,
                            camera.aspect,
                            camera.near,
                            camera.far,
                    /*out*/ camera._projectionMatrix);
                    }
                }
            },

            updateViewMatrix: function(entity) {
                var camera = entity.getComponent('Camera');
                var transform = entity.getComponent('Transform');

                if (camera.isDirty()) {
                    if (camera.hasTarget()) {
                        Matrix4.createLookAt(transform.getPosition(), 
                                            camera.getTargetPosition(), 
                                            camera.up, 
                                            /*out*/ camera._viewMatrix);
                    } else {
                        // If you only have the camera transformation and you want
                        // to compute the view matrix that will correctly transform
                        // vertices from world-space to view-space, you only need 
                        // to take the inverse of the camera transform.
                        Matrix4.inverse(transform.getWorldMatrix(), camera._viewMatrix);
                    }
                }
            },

            update: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        this.updateProjectionMatrix(entity);
                        this.updateViewMatrix(entity);
                    }
                }
            }
        });

        return CameraController;
    }
);
