define([
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
                new VertexElement(4*3, VertexElement.Vector4, "aVertexColor")
               //new VertexElement(4*6, VertexElement.Vector2, "aTextureCoord")
            );

            this.uMVMatrix = this.device.getUniformLocation(this.effect, 'uMVMatrix');
            this.uPMatrix = this.device.getUniformLocation(this.effect, 'uPMatrix');

            var vertices = new Float32Array([
                // Front face
                -1.0, -1.0,  1.0, 1.0, 0.0, 0.0, 1.0,
                 1.0, -1.0,  1.0, 1.0, 0.0, 0.0, 1.0,
                 1.0,  1.0,  1.0, 1.0, 0.0, 0.0, 1.0,
                -1.0,  1.0,  1.0, 1.0, 0.0, 0.0, 1.0,

                // Back face
                -1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
                -1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
                 1.0,  1.0, -1.0, 0.0, 1.0, 0.0, 1.0,
                 1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0,

                // Top face
                -1.0,  1.0, -1.0, 0.0, 0.0, 1.0, 1.0,
                -1.0,  1.0,  1.0, 0.0, 0.0, 1.0, 1.0,
                 1.0,  1.0,  1.0, 0.0, 0.0, 1.0, 1.0,
                 1.0,  1.0, -1.0, 0.0, 0.0, 1.0, 1.0,

                // Bottom face
                -1.0, -1.0, -1.0, 0.5, 0.0, 0.0, 1.0,
                 1.0, -1.0, -1.0, 0.5, 0.0, 0.0, 1.0,
                 1.0, -1.0,  1.0, 0.5, 0.0, 0.0, 1.0,
                -1.0, -1.0,  1.0, 0.5, 0.0, 0.0, 1.0,
                                                     
                // Right face                        
                 1.0, -1.0, -1.0, 0.0, 0.5, 0.0, 1.0,
                 1.0,  1.0, -1.0, 0.0, 0.5, 0.0, 1.0,
                 1.0,  1.0,  1.0, 0.0, 0.5, 0.0, 1.0,
                 1.0, -1.0,  1.0, 0.0, 0.5, 0.0, 1.0,
                                                     
                // Left face                         
                -1.0, -1.0, -1.0, 0.0, 0.0, 0.5, 1.0,
                -1.0, -1.0,  1.0, 0.0, 0.0, 0.5, 1.0,
                -1.0,  1.0,  1.0, 0.0, 0.0, 0.5, 1.0,
                -1.0,  1.0, -1.0, 0.0, 0.0, 0.5, 1.0,
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

                var fov = 45;
                var aspect = this.width / this.height;
                var near = 0.1;
                var far = 100;
                
                delta *= 0.001;
                var position = new Vector3(Math.sin(delta)*4, Math.sin(delta)*2+1, Math.cos(delta)*4);
                var target = new Vector3(0, 0, 0);
                
                var view = new Matrix4();
                var proj = new Matrix4();

                Matrix4.createPerspective(fov, aspect, near, far, /*out*/ proj);
                Matrix4.createLookAt(position, target, Vector3.UP, /*out*/ view);

                this.device.bindShader(this.effect, this.vertexDeclaration);

                this.device.setUniformData(this.uMVMatrix, view);
                this.device.setUniformData(this.uPMatrix, proj);

                this.device.bindVertexBuffer(this.vertexBuffer);
                this.device.bindIndexBuffer(this.indexBuffer);

                //this.device.drawIndexedPrimitives(this.device.TRIANGLES, this.indexBuffer.length, );
                gl.drawElements(gl.TRIANGLES, this.indexBuffer.length, gl.UNSIGNED_SHORT, 0);
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
