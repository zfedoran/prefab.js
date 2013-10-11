define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'camera/perspective',
        'camera/orthographic',
        'graphics/device',
        'graphics/vertexDeclaration',
        'graphics/vertexElement',
        'graphics/primitiveBatch',
        'graphics/texture',
        'graphics/spriteFont',
        'core/entity',
        'core/entityManager',
        'entities/GUILayer',
        'entities/camera',
        'systems/cameraSystem',
        'text!shaders/vertex.shader',
        'text!shaders/fragment.shader',
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        Matrix4,
        PerspectiveCamera,
        OrthographicCamera,
        GraphicsDevice,
        VertexDeclaration,
        VertexElement,
        PrimitiveBatch,
        Texture,
        SpriteFont,
        Entity,
        EntityManager,
        GUILayer,
        Camera,
        CameraSystem,
        textVertexSource,
        textFragmentSource
    ) {

        var Application = function() {
            this.width = 720;
            this.height = 480;
            this.backgroundColor = new Vector4(0.5, 0.5, 0.5, 1.0);

            this.device = new GraphicsDevice(this.width, this.height);

            this.effect = this.device.compileShader(textVertexSource, textFragmentSource);

            this.uMMatrix = this.effect.uniforms.uMMatrix;
            this.uVMatrix = this.effect.uniforms.uVMatrix;
            this.uPMatrix = this.effect.uniforms.uPMatrix;
            this.uNMatrix = this.effect.uniforms.uNMatrix;
            this.uSampler = this.effect.uniforms.uSampler;

            /*
            var canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;

            var ctx = canvas.getContext('2d');
            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillRect (10, 10, 55, 50);

            ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
            ctx.fillRect (30, 30, 55, 50);

            var texture = new Texture(this.device, canvas);
            texture.sendToGPU(this.device);
            this.uSampler.set(texture);
            */
            
            this.spriteFont = new SpriteFont({
                font: "arial",
                size: 14,
                characters: {
                    from: 33,
                    to: 126
                },
                vspace: 4,
                hspace: 0
            });
            
            this.spriteFont.sendToGPU(this.device);
            this.uSampler.set(this.spriteFont);

            this.vertexDeclaration = new VertexDeclaration([
                new VertexElement(0, VertexElement.Vector3, 'aVertexPosition'),
                new VertexElement(4*3, VertexElement.Vector3, 'aVertexNormal'),
                new VertexElement(4*6, VertexElement.Vector2, 'aTextureCoord')
            ]);

            this.primitiveBatch = new PrimitiveBatch(this.device);

            this.device.initDefaultState();

            this.entityManager = new EntityManager();
            this.cameraSystem = new CameraSystem(this.entityManager);

            this.camera = new Camera(this.width, this.height, 0.1, 100, 75);
            this.guiLayer = new GUILayer(this.width, this.height);

            this.entityManager.addEntity(this.camera);
            this.entityManager.addEntity(this.guiLayer);

            this.initEvents();
            this.onResize();

            var _this = this;
            function loop(time) {
                requestAnimationFrame(loop);
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
                transform.localPosition.x = Math.cos(this.time*0.001)*20;
                transform.localPosition.y = 5;
                transform.localPosition.z = Math.sin(this.time*0.001)*20;
                transform.setDirty(true);

                var view = this.camera.getComponent('View');
                view.target = new Vector3(0, 0, 0);
                view.setDirty(true);

                this.cameraSystem.update();

                this.draw(this.elapsed);
            },
            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);

                
                this.device.bindShader(this.effect);

                var proj, view;
                proj = this.camera.getComponent('Projection');
                view = this.camera.getComponent('View');

                var transform = Matrix4.createTranslation(0, 5, -10);
                Matrix4.multiply(transform, Matrix4.createScale(5,5,5), transform);

                this.uMMatrix.set(transform);
                this.uVMatrix.set(view._viewMatrix);
                this.uPMatrix.set(proj._projectionMatrix);
                this.uNMatrix.set(new Matrix4());

                this.device.bindVertexDeclaration(this.vertexDeclaration);

                this.primitiveBatch.begin(GraphicsDevice.TRIANGLES, 8);

                var c = String.fromCharCode(Math.floor(Math.sin(this.time*0.0001) * 20 + 80));
                var u = this.spriteFont.sprites[c].getUCoordinate();
                var v = this.spriteFont.sprites[c].getVCoordinate();
                var w = this.spriteFont.sprites[c].getUVWidth();
                var h = this.spriteFont.sprites[c].getUVHeight();

                this.primitiveBatch.addVertex([ -0.5, -0.5, -0.5,    0.0, 0.0, 1.0,    0, 0]);
                this.primitiveBatch.addVertex([  0.5, -0.5, -0.5,    0.0, 0.0, 1.0,    1, 0]);
                this.primitiveBatch.addVertex([  0.5,  0.5, -0.5,    0.0, 0.0, 1.0,    1, 1]);
                                                                                           
                this.primitiveBatch.addVertex([ -0.5, -0.5, -0.5,    0.0, 0.0, 1.0,    0, 0]);
                this.primitiveBatch.addVertex([  0.5,  0.5, -0.5,    0.0, 0.0, 1.0,    1, 1]);
                this.primitiveBatch.addVertex([ -0.5,  0.5, -0.5,    0.0, 0.0, 1.0,    0, 1]);

                this.primitiveBatch.end();


                transform = Matrix4.createTranslation(250, 250, 0);
                //Matrix4.multiply(transform, Matrix4.createRotationX(this.time*0.001), transform);
                Matrix4.multiply(transform, Matrix4.createScale(this.spriteFont.sprites[c].width,this.spriteFont.sprites[c].height,1), transform);

                proj = this.guiLayer.getComponent('Projection');
                view = this.guiLayer.getComponent('View');

                this.uMMatrix.set(transform);
                this.uVMatrix.set(view._viewMatrix);
                this.uPMatrix.set(proj._projectionMatrix);

                this.primitiveBatch.begin(GraphicsDevice.TRIANGLES, 8);

                this.primitiveBatch.addVertex([ -0.5, -0.5, -0.5,    0.0, 0.0, 1.0,    u + 0,  v + 0]);
                this.primitiveBatch.addVertex([  0.5, -0.5, -0.5,    0.0, 0.0, 1.0,    u + w,  v + 0]);
                this.primitiveBatch.addVertex([  0.5,  0.5, -0.5,    0.0, 0.0, 1.0,    u + w,  v + h]);
                                                                  
                this.primitiveBatch.addVertex([ -0.5, -0.5, -0.5,    0.0, 0.0, 1.0,    u + 0,  v + 0]);
                this.primitiveBatch.addVertex([  0.5,  0.5, -0.5,    0.0, 0.0, 1.0,    u + w,  v + h]);
                this.primitiveBatch.addVertex([ -0.5,  0.5, -0.5,    0.0, 0.0, 1.0,    u + 0,  v + h]);

                this.primitiveBatch.end();

                transform = Matrix4.createTranslation(150, 80, 0);
                Matrix4.multiply(transform, Matrix4.createScale(this.spriteFont.getWidth(),this.spriteFont.getHeight(),1), transform);

                this.uMMatrix.set(transform);
                this.uVMatrix.set(view._viewMatrix);
                this.uPMatrix.set(proj._projectionMatrix);

                this.primitiveBatch.begin(GraphicsDevice.TRIANGLES, 8);

                this.primitiveBatch.addVertex([ -0.5, -0.5, -0.5,    0.0, 0.0, 1.0,    0, 0]);
                this.primitiveBatch.addVertex([  0.5, -0.5, -0.5,    0.0, 0.0, 1.0,    1, 0]);
                this.primitiveBatch.addVertex([  0.5,  0.5, -0.5,    0.0, 0.0, 1.0,    1, 1]);
                                                                  
                this.primitiveBatch.addVertex([ -0.5, -0.5, -0.5,    0.0, 0.0, 1.0,    0, 0]);
                this.primitiveBatch.addVertex([  0.5,  0.5, -0.5,    0.0, 0.0, 1.0,    1, 1]);
                this.primitiveBatch.addVertex([ -0.5,  0.5, -0.5,    0.0, 0.0, 1.0,    0, 1]);

                this.primitiveBatch.end();

            },
            initEvents: function() {
                $(window).on('resize', $.proxy(this.onResize, this));
            },
            removeEvents: function() {
                $(window).off('resize');
            },
            onResize: function(evt) {
                this.width = $(window).width();
                this.height = $(window).height();
                this.device.setSize(this.width, this.height);
            }
        };

        function drawSphereTmp(primitiveBatch) {
            var vertices = [
                new Vector3(-1.0, -1.0,  1.0),
                new Vector3( 1.0, -1.0,  1.0),
                new Vector3( 1.0,  1.0,  1.0),
                new Vector3(-1.0,  1.0,  1.0),
                    
                new Vector3(-1.0, -1.0, -1.0),
                new Vector3(-1.0,  1.0, -1.0),
                new Vector3( 1.0,  1.0, -1.0),
                new Vector3( 1.0, -1.0, -1.0),

                new Vector3(-1.0,  1.0, -1.0),
                new Vector3(-1.0,  1.0,  1.0),
                new Vector3( 1.0,  1.0,  1.0),
                new Vector3( 1.0,  1.0, -1.0),

                new Vector3(-1.0, -1.0, -1.0),
                new Vector3( 1.0, -1.0, -1.0),
                new Vector3( 1.0, -1.0,  1.0),
                new Vector3(-1.0, -1.0,  1.0),

                new Vector3( 1.0, -1.0, -1.0),
                new Vector3( 1.0,  1.0, -1.0),
                new Vector3( 1.0,  1.0,  1.0),
                new Vector3( 1.0, -1.0,  1.0),

                new Vector3(-1.0, -1.0, -1.0),
                new Vector3(-1.0, -1.0,  1.0),
                new Vector3(-1.0,  1.0,  1.0),
                new Vector3(-1.0,  1.0, -1.0)
            ];
            var faces = [
                0,  1,  2,      0,  2,  3,    // front
                4,  5,  6,      4,  6,  7,    // back
                8,  9,  10,     8,  10, 11,   // top
                12, 13, 14,     12, 14, 15,   // bottom
                16, 17, 18,     16, 18, 19,   // right
                20, 21, 22,     20, 22, 23    // left
            ];

            primitiveBatch.begin(GraphicsDevice.TRIANGLES, 10);

            var i, a, b, c, ab, ac, bc, dir, len;
            for (i = 0; i<faces.length; i+=3) {
                a = vertices[faces[i]];
                b = vertices[faces[i+1]];
                c = vertices[faces[i+2]];

                a.normalize();
                b.normalize();
                c.normalize();

                dir = Vector3.subtract(a, b);
                len = dir.length();
                dir.normalize();
                ab = Vector3.add(b, Vector3.multiplyScalar(dir, len / 2));

                dir = Vector3.subtract(a, c);
                len = dir.length();
                dir.normalize();
                ac = Vector3.add(c, Vector3.multiplyScalar(dir, len / 2));

                dir = Vector3.subtract(b, c);
                len = dir.length();
                dir.normalize();
                bc = Vector3.add(c,Vector3.multiplyScalar(dir, len / 2));

                ab.normalize();
                ac.normalize();
                bc.normalize();

                v = ab;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);
                v = bc;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);
                v = ac;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);

                v = a;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);
                v = ab;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);
                v = ac;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);

                v = ab;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);
                v = b;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);
                v = bc;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);

                v = ac;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);
                v = bc;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);
                v = c;
                primitiveBatch.addVertex([ v.x, v.y, v.z,   0.5,0.5,0.5,1,   v.x, v.y, v.z ]);
            }

            primitiveBatch.end();
        }
        return Application;
    }
);
