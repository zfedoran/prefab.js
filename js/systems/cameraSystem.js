define([
        'lodash',
        'math/matrix4',
        'core/subSystem'
    ],
    function(
        _,
        Matrix4,
        SubSystem
    ) {
        'use strict';

        var CameraSystem = function(entityManager) {
            SubSystem.call(this, entityManager, ['Transform', 'Camera']);
        };

        CameraSystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: CameraSystem,

            updateProjectionMatrix: function(entity) {
                var camera = entity.getComponent('Camera');
                var guiLayer = entity.getComponent('GUILayer');

                if (camera.isDirty()) {
                    camera.aspect = camera.width / camera.height;
                    if (typeof guiLayer !== 'undefined') {
                        var rect = guiLayer.boundingBox;
                        Matrix4.createOrthographic(-rect.x, rect.width - rect.x, -rect.y, rect.height - rect.y, camera.near, camera.far, /*out*/ camera._projectionMatrix);
                    } else if (camera.isOrthographic()){
                        Matrix4.createOrthographic(-camera.width/2, camera.width/2, -camera.height/2, camera.height/2, camera.near, camera.far, /*out*/ camera._projectionMatrix);
                    } else {
                        Matrix4.createPerspective(camera.fov, camera.aspect, camera.near, camera.far, /*out*/ camera._projectionMatrix);
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

        return CameraSystem;
    }
);
