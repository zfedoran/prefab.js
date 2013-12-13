define([
        'jquery',
        'lodash',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'math/rectangle',
        'graphics/device',
        'graphics/texture',
        'graphics/sprite',
        'core/entity',
        'core/entityManager',
        'core/application',
        'entities/guiText',
        'entities/guiLayer',
        'entities/camera',
        'entities/block',
        'entities/grid',
        'systems/cameraSystem',
        'systems/guiSystem',
        'systems/blockSystem',
        'systems/gridSystem',
        'systems/renderSystem'
    ],
    function(
        $,
        _,
        Vector3,
        Vector4,
        Matrix4,
        Rectangle,
        GraphicsDevice,
        Texture,
        Sprite,
        Entity,
        EntityManager,
        Application,
        GUITextEntity,
        GUILayerEntity,
        CameraEntity,
        BlockEntity,
        GridEntity,
        CameraSystem,
        GUISystem,
        BlockSystem,
        GridSystem,
        RenderSystem
    ) {
        'use strict';

        var Construct = function() {
            Application.call(this);
        };

        Construct.prototype = _.create(Application.prototype, {
            constructor: Construct,

            loadAssets: function() {
            },

            unloadAssets: function() {
            },

            init: function() {
                this.entityManager = new EntityManager();
                this.cameraSystem = new CameraSystem(this.entityManager);
                this.guiSystem = new GUISystem(this.entityManager, this.device);
                this.blockSystem = new BlockSystem(this.entityManager, this.device);
                this.gridSystem = new GridSystem(this.entityManager, this.device);
                this.renderSystem = new RenderSystem(this.entityManager, this.device);

                this.camera = new CameraEntity(this.width, this.height, 0.1, 100, 75);
                this.entityManager.addEntity(this.camera);

                this.guiText = new GUITextEntity(new Rectangle(0, 0, 1000, 100), 'hello, world');
                this.guiLayer = new GUILayerEntity(this.width, this.height, 0, 0);

                this.entityManager.addEntity(this.guiText);
                this.entityManager.addEntity(this.guiLayer);
                
                this.grid = new GridEntity(50, 50, 50);
                this.entityManager.addEntity(this.grid);

                this.block = new BlockEntity(1, 1, 1);
                var blockComponent = this.block.getComponent('Block');

                var canvas, ctx, texture, sprites = [], width;
                canvas = document.createElement('canvas');
                canvas.width = 64*6; canvas.height = 64;
                $('body').append(canvas);
                ctx = canvas.getContext('2d');
                texture = new Texture(this.device, canvas);

                ctx.font = "50px sans-serif";
                width = 64;

                ctx.fillStyle = "#f00";
                ctx.fillText('Fy', 0 * width, 50);
                ctx.fillStyle = "#0f0";
                ctx.fillText('Fz', 1 * width, 50);
                ctx.fillStyle = "#00f";
                ctx.fillText('Fx', 2 * width, 50);
                ctx.fillStyle = "#800";
                ctx.fillText('Fy', 3 * width, 50);
                ctx.fillStyle = "#080";
                ctx.fillText('Fz', 4 * width, 50);
                ctx.fillStyle = "#008";
                ctx.fillText('Fx', 5 * width, 50);

                sprites.push(new Sprite(new Rectangle(0 * width, 0, width,  64), texture));
                sprites.push(new Sprite(new Rectangle(1 * width, 0, width,  64), texture));
                sprites.push(new Sprite(new Rectangle(2 * width, 0, width,  64), texture));
                sprites.push(new Sprite(new Rectangle(3 * width, 0, width,  64), texture));
                sprites.push(new Sprite(new Rectangle(4 * width, 0, width,  64), texture));
                sprites.push(new Sprite(new Rectangle(5 * width, 0, width,  64), texture));

                blockComponent.top = sprites[0]; //red
                blockComponent.left = sprites[1]; //green
                blockComponent.front = sprites[2]; //blue
                blockComponent.bottom = sprites[3]; //red
                blockComponent.right = sprites[4]; //green
                blockComponent.back = sprites[5]; //blue

                var material = this.block.getComponent('MeshRenderer').material;
                material.diffuseMap = texture;
                material.setDirty(true);

                this.entityManager.addEntity(this.block);

                this.renderSystem.setDefaultCamera(this.camera);
                this.renderSystem.setDefaultCamera(this.guiLayer);
            },

            update: function(elapsed) {
                var transform = this.camera.getComponent('Transform');
                transform.localPosition.x = Math.sin(this.time * 0.0001) * 5;
                transform.localPosition.y = Math.sin(this.time * 0.0001) * 5;
                transform.localPosition.z = Math.cos(this.time * 0.0001) * 5;
                transform.setDirty(true);

                var view = this.camera.getComponent('View');
                view.target = new Vector3(0,0,0);
                view.setDirty(true);

                var text = this.guiText.getComponent('GUIText');
                text.content = view._viewMatrix.toString();
                text.setDirty(true);

                this.cameraSystem.update();
                this.blockSystem.update();
                this.gridSystem.update();
                this.guiSystem.update();
            },

            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);
                this.renderSystem.render();
            }
        });

        return Construct;
    }
);
