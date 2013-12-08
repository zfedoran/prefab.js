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
        'graphics/material',
        'core/entity',
        'core/entityManager',
        'core/application',
        'entities/guiText',
        'entities/guiLayer',
        'entities/camera',
        'entities/block',
        'systems/cameraSystem',
        'systems/guiSystem',
        'systems/blockSystem',
        'systems/renderSystem',
        'text!shaders/vertex.shader',
        'text!shaders/fragment.shader'
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
        Material,
        Entity,
        EntityManager,
        Application,
        GUITextEntity,
        GUILayerEntity,
        CameraEntity,
        BlockEntity,
        CameraSystem,
        GUISystem,
        BlockSystem,
        RenderSystem,
        textVertexSource,
        textFragmentSource
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
                this.renderSystem = new RenderSystem(this.entityManager, this.device);

                this.camera = new CameraEntity(this.width, this.height, 0.1, 100, 75);
                this.entityManager.addEntity(this.camera);

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

                var material = new Material();
                material.diffuseMap = texture;
                this.block.getComponent('MeshRenderer').material = material;

                this.entityManager.addEntity(this.block);

                this.renderSystem.setDefaultCamera(this.camera);


                /*
                this.guiText = new GUITextEntity(new Rectangle(20, 40, 1000, 100), '', {
                    fontFamily: 'monospace',
                    fontSize: 10,
                    lineHeight: 10
                });
                this.guiLayer = new GUILayerEntity(0, 0, this.width, this.height);

                this.entityManager.addEntity(this.guiText);
                this.entityManager.addEntity(this.guiLayer);

                this.shader = this.device.compileShader(textVertexSource, textFragmentSource);
                this.uMMatrix = this.shader.uniforms.uMMatrix;
                this.uVMatrix = this.shader.uniforms.uVMatrix;
                this.uPMatrix = this.shader.uniforms.uPMatrix;
                this.uNMatrix = this.shader.uniforms.uNMatrix;
                this.uSampler = this.shader.uniforms.uSampler;
                */
            },

            update: function(elapsed) {
                var transform = this.camera.getComponent('Transform');
                transform.localPosition.x = Math.sin(this.time * 0.001) * 5;
                transform.localPosition.y = Math.sin(this.time * 0.0001) * 5;
                transform.localPosition.z = Math.cos(this.time * 0.001) * 5;
                transform.setDirty(true);

                var view = this.camera.getComponent('View');
                view.target = new Vector3(0,0,0);
                view.setDirty(true);

                this.cameraSystem.update();
                this.blockSystem.update();
            },

            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);

                this.renderSystem.render();

                /*
                this.device.bindShader(this.shader);

                var view = this.guiLayer.getComponent('View')._viewMatrix;
                var proj = this.guiLayer.getComponent('Projection')._projectionMatrix;

                var text = this.guiText.getComponent('GUIText');
                text.content = this.camera.getComponent('View')._viewMatrix.toString();
                text.setDirty(true);

                var transform = this.guiText.getComponent('Transform').getWorldMatrix();

                this.uMMatrix.set(transform);
                this.uVMatrix.set(view);
                this.uPMatrix.set(proj);

                this.guiSystem.update();
                */
            }
        });

        return Construct;
    }
);
