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
        'core/entity',
        'core/entityManager',
        'components/transform',
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
        Entity,
        EntityManager,
        Transform,
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

            this.vertexDeclaration = new VertexDeclaration(
                new VertexElement(0, VertexElement.Vector3, 'aVertexPosition'),
                new VertexElement(4*3, VertexElement.Vector4, 'aVertexColor'),
                new VertexElement(4*7, VertexElement.Vector3, 'aVertexNormal')
            );

            this.primitiveBatch = new PrimitiveBatch(this.device);

            this.device.initDefaultState();

            this.camera3 = new PerspectiveCamera(75, this.width/this.height, 0.1, 100);
            this.camera2 = new OrthographicCamera(this.width, this.height, 0.1, 100, true);

            this.entityManager = new EntityManager();
            this.entityManager.addFilter('transform', function(entity) {
                return entity.hasComponent(Transform);
            });

            var entity = new Entity();
            entity.on('component.added', function(i) { console.log(i); }, this);
            entity.addComponent(new Transform());

            this.entityManager.addEntity(entity);

            this.initEvents();
            this.onResize();

            var _this = this;
            function loop(time) {
                requestAnimationFrame(loop);
                _this.update(time);
            }
            loop(0);
        };

        Application.prototype = {
            constructor: Application,
            update: function(time) {
                this.elapsed = time - time.time;
                this.time = time;

                this.camera3.position = new Vector3(Math.sin(-this.time*0.001)*20, 2, Math.cos(-this.time*0.001)*20);
                this.camera3.target = new Vector3(0, 0, 0);
                this.camera3.update(this.elapsed);

                this.camera2.update(this.elapsed);

                this.draw(this.elapsed);
            },
            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);

                var transform = Matrix4.createTranslation(0, 5, -10);
                Matrix4.multiply(transform, Matrix4.createScale(5,5,5), transform);

                var nm = Matrix4.multiply(this.camera3.view, transform);
                nm.inverse();
                nm.transpose();
                //nm = Matrix4.createNormalMatrix(nm);
                
                this.device.bindShader(this.effect);

                this.uMMatrix.set(transform);
                this.uVMatrix.set(this.camera3.view);
                this.uPMatrix.set(this.camera3.proj);
                this.uNMatrix.set(nm);

                this.device.bindVertexDeclaration(this.vertexDeclaration);
                this.device.bindVertexBuffer(this.vertexBuffer);

                drawSphereTmp(this.primitiveBatch);
                /*
                this.primitiveBatch.begin(GraphicsDevice.TRIANGLES, 10);

                this.primitiveBatch.addVertex([ -5.0, -1.0,  1.0,   0.0, 0.0, 1, 1.0,   0.0, 0.0, 1.0 ]);
                this.primitiveBatch.addVertex([ 1.0, 5.0,  -1.0,   1, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0 ]);
                this.primitiveBatch.addVertex([ 1.0, -1.0,  5.0,   0.0, 1, 0.0, 1.0,   0.0, 1.0, 0.0 ]);

                this.primitiveBatch.end();
                */
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
                this.camera3.aspect = this.width/this.height;
                this.camera2.width = this.width;
                this.camera2.height = this.height;
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
