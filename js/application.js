define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'graphics/device',
        'graphics/vertexDeclaration',
        'graphics/vertexElement',
        'text!shaders/vertex.shader',
        'text!shaders/fragment.shader',
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        Matrix4,
        GraphicsDevice,
        VertexDeclaration,
        VertexElement,
        textVertexSource,
        textFragmentSource
    ) {

        var Application = function() {
            this.width = 720;
            this.height = 480;
            this.backgroundColor = new Vector4(0.5, 0.5, 0.5, 1.0);

            this.device = new GraphicsDevice(this.width, this.height);

            this.effect = this.device.compileShader(textVertexSource, textFragmentSource);
            this.vertexDeclaration = new VertexDeclaration(
                new VertexElement(0, VertexElement.Vector3, "aVertexPosition"),
                new VertexElement(4*3, VertexElement.Vector4, "aVertexColor"),
                new VertexElement(4*7, VertexElement.Vector3, "aVertexNormal")
            );

            this.uMMatrix = this.device.getUniformLocation(this.effect, 'uMMatrix');
            this.uVMatrix = this.device.getUniformLocation(this.effect, 'uVMatrix');
            this.uPMatrix = this.device.getUniformLocation(this.effect, 'uPMatrix');
            this.uNMatrix = this.device.getUniformLocation(this.effect, 'uNMatrix');

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

            this.initEvents();
            this.onResize();

            var _this = this;
            function loop(time) {
                requestAnimationFrame(loop);
                _this.draw(time);
            }
            loop(0);
        };

        Application.prototype = {
            constructor: Application,
            draw: function(delta) {
                //this.device.setViewport(0, 0, this.height, this.width);
                this.device.clear(this.backgroundColor);

                var fov = 75;
                var aspect = this.width / this.height;
                var near = 0.1;
                var far = 100;
                
                delta *= 0.001;
                var position = new Vector3(Math.sin(-delta)*20, 10, Math.cos(-delta)*20);
                //var position = new Vector3(10, 10, 10);
                var target = new Vector3(0, 5, 0);
                
                var view = new Matrix4();
                var proj = new Matrix4();

                Matrix4.createPerspective(fov, aspect, near, far, /*out*/ proj);
                Matrix4.createLookAt(position, target, Vector3.UP, /*out*/ view);

                if (!this.something) {
                    this.something = 1;
                    console.log(proj.toString());
                    //proj = new Matrix4(1.8106601717798214, 0, 0, 0, 0, 2.4142135623730954, 0, 0, 0, 0, -1.002002002002002, -1, 0, 0, -0.20020020020020018, 0);
                    //console.log(proj.toString());
                }

                var transform = Matrix4.createTranslation(0, 5, 0);
                //Matrix4.multiply(transform, Matrix4.createRotationX(delta), transform);
                //Matrix4.multiply(transform, Matrix4.createRotationY(delta), transform);

                var normalMatrix = Matrix4.multiply(transform, view);

                normalMatrix.elements[3] = 0;
                normalMatrix.elements[7] = 0;
                normalMatrix.elements[11] = 0;
                normalMatrix.elements[12] = 0;
                normalMatrix.elements[13] = 0;
                normalMatrix.elements[14] = 0;

                normalMatrix.inverse();
                normalMatrix.transpose();

                this.device.bindShader(this.effect, this.vertexDeclaration);

                this.device.setUniformData(this.uMMatrix, transform);
                this.device.setUniformData(this.uVMatrix, view);
                this.device.setUniformData(this.uPMatrix, proj);
                this.device.setUniformData(this.uNMatrix, normalMatrix);

                this.device.bindVertexBuffer(this.vertexBuffer);
                this.device.bindIndexBuffer(this.indexBuffer);

                this.device.drawIndexedPrimitives(GraphicsDevice.TRIANGLES, this.indexBuffer.length, GraphicsDevice.UNSIGNED_SHORT, 0);

                transform = Matrix4.createTranslation(0, 0, 0);
                this.device.setUniformData(this.uMMatrix, transform);

                this.device.drawIndexedPrimitives(GraphicsDevice.TRIANGLES, this.indexBuffer.length, GraphicsDevice.UNSIGNED_SHORT, 0);
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
                this.draw();
            }
        };

        return Application;
    }
);
