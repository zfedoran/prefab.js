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

            this.shader = this.device.compileShader(textVertexSource, textFragmentSource);
            this.vertexDeclaration = new VertexDeclaration(
                new VertexElement(0, VertexElement.Vector3, "aPosition")
               //new VertexElement(4*3, VertexElement.Vector3, "aNormal"),
               //new VertexElement(4*6, VertexElement.Vector2, "aTextureCoord")
            );

            var vertices = new Float32Array([
                1.0,  1.0,  0.0,
                -1.0, 1.0,  0.0,
                1.0,  -1.0, 0.0,
                -1.0, -1.0, 0.0
            ]);
            this.vertexBuffer = this.device.createBuffer();
            this.device.setVertexBufferData(this.vertexBuffer, vertices);

            this.device.initDefaultState();

            this.initEvents();
            this.onResize();

            this.draw();
        };

        Application.prototype = {
            constructor: Application,
            draw: function() {
                this.device.setViewport(0, 0, this.height, this.width);
                this.device.clear(this.backgroundColor);

                var fov = 1;
                var aspect = 640.0 / 480.0;
                var near = 0.1;
                var far = 100;
                
                var position = new Vector3(0, 0, -6);
                var target = new Vector3(0, 0, 0);
                
                var view = new Matrix4();
                var proj = new Matrix4();

                //Matrix4.createOrthographic(10, -10, 10, -10, 0.1, 100, /*out*/ proj);
                Matrix4.createPerspective(fov, aspect, near, far, /*out*/ proj);
                Matrix4.createLookAt(position, target, Vector3.UP, /*out*/ view);

                this.device.bindShader(this.shader, this.vertexDeclaration);
                this.device.bindVertexBuffer(this.vertexBuffer);

                var uView = this.device.getUniformLocation(this.shader, 'uMVMatrix');
                var uProj = this.device.getUniformLocation(this.shader, 'uPMatrix');

                this.device.setUniformData(uView, view.elements);
                this.device.setUniformData(uProj, proj.elements);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                console.log(view.toString());
                console.log(proj.toString());
            },
            initEvents: function() {
                $(window).on('resize', $.proxy(this.onResize, this));
            },
            removeEvents: function() {
                $(window).off('resize');
            },
            onResize: function(evt) {
                var width = $(window).width();
                var height = $(window).height();
                this.device.setSize(width, height);
            }
        };

        return Application;
    }
);
