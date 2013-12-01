define([
        'jquery',
        'lodash',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'math/rectangle',
        'graphics/device',
        'core/entity',
        'core/entityManager',
        'core/application',
        'entities/guiText',
        'entities/guiLayer',
        'entities/camera',
        'systems/cameraSystem',
        'systems/guiSystem',
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
        Entity,
        EntityManager,
        Application,
        GUITextEntity,
        GUILayerEntity,
        CameraEntity,
        CameraSystem,
        GUISystem,
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
                this.renderSystem = new RenderSystem(this.entityManager, this.device);

                this.camera = new CameraEntity(this.width, this.height, 0.1, 100, 75);
                this.guiText = new GUITextEntity(new Rectangle(20, 40, 1000, 100), '', {
                    fontFamily: 'monospace',
                    fontSize: 10
                });
                this.guiLayer = new GUILayerEntity(0, 0, this.width, this.height);

                this.entityManager.addEntity(this.camera);
                this.entityManager.addEntity(this.guiText);
                this.entityManager.addEntity(this.guiLayer);

                this.shader = this.device.compileShader(textVertexSource, textFragmentSource);
                this.uMMatrix = this.shader.uniforms.uMMatrix;
                this.uVMatrix = this.shader.uniforms.uVMatrix;
                this.uPMatrix = this.shader.uniforms.uPMatrix;
                this.uNMatrix = this.shader.uniforms.uNMatrix;
                this.uSampler = this.shader.uniforms.uSampler;
            },

            update: function(elapsed) {
                var transform = this.camera.getComponent('Transform');
                transform.localPosition.x = Math.sin(this.time * 0.001) * 50;
                transform.localPosition.y = 10;
                transform.localPosition.z = Math.cos(this.time * 0.001) * 50;
                transform.setDirty(true);

                var view = this.camera.getComponent('View');
                view.target = new Vector3(0,0,0);
                view.setDirty(true);

                this.cameraSystem.update();
                //this.renderSystem.update();
            },

            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);
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
            }
        });

        return Construct;
    }
);
