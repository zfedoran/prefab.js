define([
    ],
    function(
    ) {
        'use strict';

        var Scene = function(entityManager) {
            if (typeof entityManager === 'undefined') {
                throw 'Scene: entityManager is undefined';
            }
            this.entityManager = entityManager;
            this.entities = {};
            this.activeCamera = null;
        };

        Scene.prototype = {
            constructor: Scene,

            addEntity: function(entity) {
                this.entities[entity.id] = entity;
                this.entityManager.addEntity(entity);
            },

            getEntity: function(id) {
                return this.entities[id];
            },

            removeEntity: function(entity) {
                var success = delete this.entities[entity.id];
                if (success) {
                    this.entityManager.removeEntity(entity);
                }
                return success;
            },

            setActiveCamera: function(entity) {
                if (entity.hasComponent('View') && entity.hasComponent('Projection')) {
                    if (this.entities[entity.id]) {
                        this.activeCamera = entity;
                    } else {
                        throw 'Scene: the camera must be part of the scene';
                    }
                } else {
                    throw 'Scene: cannot setActiveCamera(entity) with an entity that does not have View and Projection components';
                }
            },

            getActiveCamera: function() {
                return this.activeCamera;
            }
        };

        return Scene;
    }
);
