define([
        'jquery',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'math/rectangle',
        'graphics/device',
        'core/entity',
        'core/entityManager',
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
        Vector3,
        Vector4,
        Matrix4,
        Rectangle,
        GraphicsDevice,
        Entity,
        EntityManager,
        GUITextEntity,
        GUILayerEntity,
        CameraEntity,
        CameraSystem,
        GUISystem,
        RenderSystem,
        textVertexSource,
        textFragmentSource
    ) {

        var Application = function() {
            this.width = 720;
            this.height = 480;
            this.backgroundColor = new Vector4(0.5, 0.5, 0.5, 1.0);

            this.device = new GraphicsDevice(this.width, this.height);
            this.device.initDefaultState();

            this.entityManager = new EntityManager();
            this.cameraSystem = new CameraSystem(this.entityManager);
            this.guiSystem = new GUISystem(this.entityManager, this.device);
            this.renderSystem = new RenderSystem(this.entityManager, this.device);

            this.camera = new CameraEntity(this.width, this.height, 0.1, 100, 75);
            this.guiText = new GUITextEntity(new Rectangle(20, 40, 1000, 100), '', {
                fontFamily: 'monospace',
                fontSize: 10,
                //lineHeight: 10
            });
            this.guiLayer = new GUILayerEntity(this.width, this.height);

            this.entityManager.addEntity(this.camera);
            this.entityManager.addEntity(this.guiText);
            this.entityManager.addEntity(this.guiLayer);

            this.shader = this.device.compileShader(textVertexSource, textFragmentSource);
            this.uMMatrix = this.shader.uniforms.uMMatrix;
            this.uVMatrix = this.shader.uniforms.uVMatrix;
            this.uPMatrix = this.shader.uniforms.uPMatrix;
            this.uNMatrix = this.shader.uniforms.uNMatrix;
            this.uSampler = this.shader.uniforms.uSampler;

            this.initEvents();
            this.onResize();

            var _this = this;
            function loop(time) {
                window.requestAnimationFrame(loop);
                _this.update(time);
            }
            loop(0);
            //this.update(0);
        };

        Application.prototype = {
            constructor: Application,
            update: function(time) {
                this.elapsed = time - time.time;
                this.time = time;

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

                this.draw(this.elapsed);
            },
            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);

                this.device.bindShader(this.shader);

                var view = this.guiLayer.getComponent('View')._viewMatrix;
                var proj = this.guiLayer.getComponent('Projection')._projectionMatrix;

                var text = this.guiText.getComponent('GUIText');
                text.content = this.camera.getComponent('View')._viewMatrix.toString();
                text.content = this.guiSystem.mousePosition.toString();
                text.setDirty(true);

                var transform = this.guiText.getComponent('Transform').getWorldMatrix();

                this.uMMatrix.set(transform);
                this.uVMatrix.set(view);
                this.uPMatrix.set(proj);

                this.guiSystem.update();

                /*
                var meshFilter = this.guiText.getComponent('MeshFilter');
                var mesh = meshFilter.mesh;

                this.device.bindVertexDeclaration(mesh._vertexDeclaration);
                this.device.bindIndexBuffer(mesh._indexBuffer);
                this.device.bindVertexBuffer(mesh._vertexBuffer);
                this.device.drawIndexedPrimitives(GraphicsDevice.TRIANGLES, mesh._indexBuffer.length, GraphicsDevice.UNSIGNED_SHORT, 0);
                */
            },
            initEvents: function() {
                $(window).on('resize', $.proxy(this.onResize, this));
                $(window).on('mousemove', $.proxy(this.onMouseMove, this));
            },
            removeEvents: function() {
                $(window).off('resize');
                $(window).off('mousemove');
            },
            onResize: function(evt) {
                this.width = $(window).width();
                this.height = $(window).height();
                this.device.setSize(this.width, this.height);

                var proj = this.guiLayer.getComponent('Projection');
                proj.width = this.width;
                proj.height = this.height;
                proj.setDirty(true);
            },
            onMouseMove: function(evt) {
                this.guiSystem.onMouseMove(evt);
            }
        };

        return Application;
    }
);
