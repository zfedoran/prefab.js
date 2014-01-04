define([
        'core/entityManager',
        'core/scene'
    ],
    function(
        EntityManager,
        Scene
    ) {
        'use strict';

        var Context = function(device) {
            this.device = device;
            this.entityManager = new EntityManager();
            this.scene = new Scene(this.entityManager, this.device);
        };

        Context.prototype = {
            constructor: Context,

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
