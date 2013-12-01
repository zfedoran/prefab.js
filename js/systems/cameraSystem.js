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
            SubSystem.call(this, entityManager, ['Transform', 'Projection', 'View']);
        };

        CameraSystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: CameraSystem,

            updateProjectionMatrix: function(entity) {
                var proj = entity.getComponent('Projection');
                var guiLayer = entity.getComponent('GUILayer');
                if (proj.isDirty()) {
                    proj.aspect = proj.width / proj.height;
                    if (typeof guiLayer !== 'undefined') {
                        var rect = guiLayer.boundingBox;
                        Matrix4.createOrthographic(-rect.x, rect.width - rect.x, -rect.y, rect.height - rect.y, proj.near, proj.far, /*out*/ proj._projectionMatrix);
                    } else if (proj.isOrthographic()){
                        Matrix4.createOrthographic(-proj.width/2, proj.width/2, -proj.height/2, proj.height/2, proj.near, proj.far, /*out*/ proj._projectionMatrix);
                    } else {
                        Matrix4.createPerspective(proj.fov, proj.aspect, proj.near, proj.far, /*out*/ proj._projectionMatrix);
                    }
                }
            },

            updateViewMatrix: function(entity) {
                var view = entity.getComponent('View');
                var transform = entity.getComponent('Transform');

                if (view.isDirty()) {
                    if (view.hasTarget()) {
                        Matrix4.createLookAt(transform.getPosition(), 
                                            view.getTargetPosition(), 
                                            view.up, 
                                            /*out*/ view._viewMatrix);
                    } else {
                        // If you only have the camera transformation and you want
                        // to compute the view matrix that will correctly transform
                        // vertices from world-space to view-space, you only need 
                        // to take the inverse of the camera transform.
                        Matrix4.inverse(transform.getWorldMatrix(), view._viewMatrix);
                    }
                }
            },

            update: function() {
                var entities = this.entityManager.getAllUsingFilter(this.filterHash);
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
