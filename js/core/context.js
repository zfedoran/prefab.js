define([
        'core/entityManager',
        'core/scene',
        'math/rectangle',
        'entities/guiLayerEntity'
    ],
    function(
        EntityManager,
        Scene,
        Rectangle,
        GUILayerEntity
    ) {
        'use strict';

        var Context = function(device) {
            this.entityManager = new EntityManager();
            this.device        = device;
            this.width         = device.getWidth();
            this.height        = device.getHeight();
            this.time          = 0;
            this.groupNameGUI  = 'GUIRenderGroup';

            this.initScene();
            this.initGUILayer();
        };

        Context.prototype = {
            constructor: Context,

            initScene: function() {
                this.scene = new Scene(this.entityManager, this.device);
            },

            initGUILayer: function() {
                var boundingRect = new Rectangle(0, 0, this.width, this.height);

                this.guiLayerEntity = new GUILayerEntity(boundingRect);
                this.entityManager.addEntity(this.guiLayerEntity);

                var cameraComponent = this.guiLayerEntity.getComponent('Camera');
                cameraComponent.addRenderGroup(this.groupNameGUI);
            },

            addGUIElement: function(entity) {
                this.entityManager.addEntity(entity);
                this.entityManager.addEntityToGroup(entity, this.groupNameGUI);
            },

            addBlock: function(width, height, depth) {
                var blockEntity = this.scene.addBlock(width, height, depth);
                this.entityManager.addEntityToGroup(blockEntity, 'CurrentSelection');
            },

            getOneSelectedBlock: function() {
                var currentSelection = this.entityManager.getAllUsingGroupName('CurrentSelection');

                // Find "one" currently selected block
                var entityId, entity;
                for (entityId in currentSelection) {
                    if (currentSelection.hasOwnProperty(entityId)) {
                        entity = currentSelection[entityId];
                        if (entity.hasComponent('Block')) {
                            return entity;
                        }
                    }
                }
            },

            getSelectedEntities: function() {
                return this.entityManager.getAllUsingGroupName('CurrentSelection');
            }
        };

        return Context;
    }
);
