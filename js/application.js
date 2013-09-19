define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'core/camera',
        'graphics/device',
        'graphics/vertexDeclaration',
        'graphics/vertexElement',
        'graphics/primitiveBatch',
        'text!shaders/vertex.shader',
        'text!shaders/fragment.shader',
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        Matrix4,
        Camera,
        GraphicsDevice,
        VertexDeclaration,
        VertexElement,
        PrimitiveBatch,
        textVertexSource,
        textFragmentSource
    ) {

        var Application = function() {
            this.width = 720;
            this.height = 480;
            this.backgroundColor = new Vector4(0.5, 0.5, 0.5, 1.0);

            this.device = new GraphicsDevice(this.width, this.height);

            this.effect = this.device.compileShader(textVertexSource, textFragmentSource);

            this.uMMatrix = this.device.getUniformLocation(this.effect, 'uMMatrix');
            this.uVMatrix = this.device.getUniformLocation(this.effect, 'uVMatrix');
            this.uPMatrix = this.device.getUniformLocation(this.effect, 'uPMatrix');
            this.uNMatrix = this.device.getUniformLocation(this.effect, 'uNMatrix');

            this.aVertexPosition = this.device.getAttributeLocation(this.effect, 'aVertexPosition');
            this.aVertexColor    = this.device.getAttributeLocation(this.effect, 'aVertexColor');
            this.aVertexNormal   = this.device.getAttributeLocation(this.effect, 'aVertexNormal');

            this.vertexDeclaration = new VertexDeclaration(
                new VertexElement(0, VertexElement.Vector3, this.aVertexPosition),
                new VertexElement(4*3, VertexElement.Vector4, this.aVertexColor),
                new VertexElement(4*7, VertexElement.Vector3, this.aVertexNormal)
            );

            this.primitiveBatch = new PrimitiveBatch(this.device);

            var vertices = new Float32Array([
                // Front face
                -1.0, -1.0,  1.0,   0.0, 0.0, 0.5, 1.0,   0.0, 0.0, 1.0,
                 1.0, -1.0,  1.0,   0.0, 0.0, 0.5, 1.0,   0.0, 0.0, 1.0,
                 1.0,  1.0,  1.0,   0.0, 0.0, 0.5, 1.0,   0.0, 0.0, 1.0,
                -1.0,  1.0,  1.0,   0.0, 0.0, 0.5, 1.0,   0.0, 0.0, 1.0,

                // Back face
                -1.0, -1.0, -1.0,   0.0, 0.0, 0.5, 1.0,   0.0, 0.0,-1.0,
                -1.0,  1.0, -1.0,   0.0, 0.0, 0.5, 1.0,   0.0, 0.0,-1.0,
                 1.0,  1.0, -1.0,   0.0, 0.0, 0.5, 1.0,   0.0, 0.0,-1.0,
                 1.0, -1.0, -1.0,   0.0, 0.0, 0.5, 1.0,   0.0, 0.0,-1.0,

                // Top face
                -1.0,  1.0, -1.0,   0.0, 0.5, 0.0, 1.0,   0.0, 1.0, 0.0,
                -1.0,  1.0,  1.0,   0.0, 0.5, 0.0, 1.0,   0.0, 1.0, 0.0,
                 1.0,  1.0,  1.0,   0.0, 0.5, 0.0, 1.0,   0.0, 1.0, 0.0,
                 1.0,  1.0, -1.0,   0.0, 0.5, 0.0, 1.0,   0.0, 1.0, 0.0,
                                                      
                // Bottom face                        
                -1.0, -1.0, -1.0,   0.0, 0.5, 0.0, 1.0,   0.0,-1.0, 0.0,
                 1.0, -1.0, -1.0,   0.0, 0.5, 0.0, 1.0,   0.0,-1.0, 0.0,
                 1.0, -1.0,  1.0,   0.0, 0.5, 0.0, 1.0,   0.0,-1.0, 0.0,
                -1.0, -1.0,  1.0,   0.0, 0.5, 0.0, 1.0,   0.0,-1.0, 0.0,
                                                       
                // Right face                          
                 1.0, -1.0, -1.0,   0.5, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0,
                 1.0,  1.0, -1.0,   0.5, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0,
                 1.0,  1.0,  1.0,   0.5, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0,
                 1.0, -1.0,  1.0,   0.5, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0,
                                                       
                // Left face                           
                -1.0, -1.0, -1.0,   0.5, 0.0, 0.0, 1.0,  -1.0, 0.0, 0.0,
                -1.0, -1.0,  1.0,   0.5, 0.0, 0.0, 1.0,  -1.0, 0.0, 0.0,
                -1.0,  1.0,  1.0,   0.5, 0.0, 0.0, 1.0,  -1.0, 0.0, 0.0,
                -1.0,  1.0, -1.0,   0.5, 0.0, 0.0, 1.0,  -1.0, 0.0, 0.0
            ]);
            this.vertexBuffer = this.device.createBuffer();
            this.device.setVertexBufferData(this.vertexBuffer, vertices);

            var indices = new Uint16Array([
                0,  1,  2,      0,  2,  3,    // front
                4,  5,  6,      4,  6,  7,    // back
                8,  9,  10,     8,  10, 11,   // top
                12, 13, 14,     12, 14, 15,   // bottom
                16, 17, 18,     16, 18, 19,   // right
                20, 21, 22,     20, 22, 23    // left
            ]);
            this.indexBuffer = this.device.createBuffer();
            this.device.setIndexBufferData(this.indexBuffer, indices);

            this.device.initDefaultState();

            this.camera = new Camera(75, this.width/this.height, 0.1, 100);

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

                this.camera.position = new Vector3(Math.sin(-this.time*0.001)*20, 10, Math.cos(-this.time*0.001)*20);
                this.camera.target = new Vector3(0, 5, 0);
                this.camera.update(this.elapsed);

                this.draw(this.elapsed);
            },
            draw: function(elapsed) {
                this.device.clear(this.backgroundColor);

                var transform = Matrix4.createTranslation(0, 5, 0);
                //Matrix4.multiply(transform, Matrix4.createRotationX(this.time * 0.001), transform);
                //Matrix4.multiply(transform, Matrix4.createRotationY(this.time * 0.001), transform);

                var normalMatrix = Matrix4.multiply(transform, this.camera.view);

                normalMatrix.elements[3] = 0;
                normalMatrix.elements[7] = 0;
                normalMatrix.elements[11] = 0;
                normalMatrix.elements[12] = 0;
                normalMatrix.elements[13] = 0;
                normalMatrix.elements[14] = 0;

                normalMatrix.inverse();
                normalMatrix.transpose();

                this.device.bindShader(this.effect);

                this.device.setUniformData(this.uMMatrix, transform);
                this.device.setUniformData(this.uVMatrix, this.camera.view);
                this.device.setUniformData(this.uPMatrix, this.camera.proj);
                this.device.setUniformData(this.uNMatrix, normalMatrix);

                this.device.bindVertexBuffer(this.vertexBuffer);
                this.device.bindVertexDeclaration(this.vertexDeclaration);

                this.device.bindIndexBuffer(this.indexBuffer);

                this.device.drawIndexedPrimitives(GraphicsDevice.TRIANGLES, this.indexBuffer.length, GraphicsDevice.UNSIGNED_SHORT, 0);

                transform = Matrix4.createTranslation(0, -5, 0);

                this.primitiveBatch.begin(GraphicsDevice.TRIANGLES, 10);

                this.device.bindVertexDeclaration(this.vertexDeclaration);

                this.primitiveBatch.addVertex([ -5.0, -1.0,  1.0,   0.0, 0.0, 1, 1.0,   0.0, 0.0, 1.0 ]);
                this.primitiveBatch.addVertex([ 1.0, 5.0,  -1.0,   1, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0 ]);
                this.primitiveBatch.addVertex([ 1.0, -1.0,  5.0,   0.0, 1, 0.0, 1.0,   0.0, 1.0, 0.0 ]);

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
                this.camera.aspect = this.width/this.height;
            }
        };

        return Application;
    }
);
