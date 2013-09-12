define([
        'graphics/device',
        'math/vector4',
        'text!shaders/vertex.shader',
        'text!shaders/fragment.shader',
    ],
    function(
        GraphicsDevice,
        Vector4,
        textVertexSource,
        textFragmentSource
    ) {
        var Application = function() {
            this.width = 720;
            this.height = 480;
            this.backgroundColor = new Vector4(0.5, 0.5, 0.5, 1.0);

            this.device = new GraphicsDevice(this.width, this.height);

            var vshader = this.device.createVertexShader(textVertexSource);
            var fshader = this.device.createFragmentShader(textFragmentSource);
            var program = this.device.createProgram(vshader, fshader);

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
