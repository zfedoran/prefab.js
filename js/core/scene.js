define([
        'math/rectangle',
        'graphics/texture',
        'graphics/sprite',
        'entities/block',
    ],
    function(
        Rectangle,
        Texture,
        Sprite,
        BlockEntity
    ) {
        'use strict';

        var Scene = function(entityManager, device) {
            if (typeof entityManager === 'undefined') {
                throw 'Scene: entityManager is undefined';
            }

            this.device = device;
            this.entityManager = entityManager;
            this.entities = {};
        };

        Scene.prototype = {
            constructor: Scene,

            addBlock: function(width, height, depth) {
                var blockEntity = new BlockEntity(width, height, depth);
                var blockComponent = blockEntity.getComponent('Block');

                width  = width * 4;
                height = height * 4;
                depth  = depth * 4;

                var textureWidth = 2 * width + 4 * depth;
                var textureHeight = Math.max(height, width);

                // TODO: find nearest power of two
                var canvas, ctx, texture;
                canvas = document.createElement('canvas');
                canvas.width = textureWidth; 
                canvas.height = textureHeight;

                ctx = canvas.getContext('2d');
                texture = new Texture(this.device, canvas);

                blockComponent.front  = new Sprite(new Rectangle(0 * width + 0 * depth, 0, width, height), texture);
                blockComponent.left   = new Sprite(new Rectangle(1 * width + 0 * depth, 0, depth, height), texture);
                blockComponent.back   = new Sprite(new Rectangle(1 * width + 1 * depth, 0, width, height), texture);
                blockComponent.right  = new Sprite(new Rectangle(2 * width + 1 * depth, 0, depth, height), texture);
                blockComponent.top    = new Sprite(new Rectangle(2 * width + 2 * depth, 0, depth, width ), texture);
                blockComponent.bottom = new Sprite(new Rectangle(2 * width + 3 * depth, 0, depth, width ), texture);

                blockComponent.texture = texture;

                var material = blockEntity.getComponent('MeshRenderer').material;
                material.diffuseMap = texture;
                material.setDirty(true);

                this.entities[blockEntity.id] = blockEntity;
                this.entityManager.addEntity(blockEntity);
                this.entityManager.addEntityToGroup(blockEntity, 'Scene');
            },

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
            }
        };

        return Scene;
    }
);
