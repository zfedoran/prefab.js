define([
    ],
    function(
    ) {

        var GraphicsDevice = function(width, height) {
                this.initCanvas();
                this.initWebGL();

                if (gl) {
                    this.setSize(width, height);
                    this.initDefaultState();
                }
        };

        GraphicsDevice.prototype = {
            constructor: GraphicsDevice,
            initCanvas: function() {
                this.canvas = document.createElement('canvas');
                document.body.appendChild(this.canvas);
            },
            initWebGL: function() {
                try {
                    gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
                } catch (error) {
                    console.error(error);
                }
            },
            initDefaultState: function() {
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            },
            clear: function(color, depth, stencil) {
                var options = 0;
                if (color) {
                    gl.clearColor(color.x, color.y, color.z, color.w);
                    options |= gl.COLOR_BUFFER_BIT;
                }
                if (depth) {
                    gl.clearDepth(depth);
                    options |= gl.DEPTH_BUFFER_BIT;
                }
                if (stencil) {
                    gl.clearStencil(stencil);
                    options |= gl.STENCIL_BUFFER_BIT;
                }
                gl.clear(options);
            },
            compileShader: function(vsource, fsource) {
                var vshader = gl.createShader(gl.VERTEX_SHADER);
                var fshader = gl.createShader(gl.FRAGMENT_SHADER);
                var program = gl.createProgram();

                gl.shaderSource(vshader, vsource);
                gl.compileShader(vshader);

                if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
                    throw gl.getShaderInfoLog(vshader);
                }

                gl.shaderSource(fshader, fsource);
                gl.compileShader(fshader);

                if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
                    throw gl.getShaderInfoLog(fshader);
                }

                gl.attachShader(program, vshader);
                gl.attachShader(program, fshader);
                gl.linkProgram(program);

                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    throw gl.getProgramInfoLog(program);
                }

                return program;
            },
            bindShader: function(program, vertexDeclaration) {
                gl.useProgram(program);

                var i, ve, attribute;
                for (i = 0; i < vertexDeclaration.length; i++) {
                    ve = vertexDeclaration.elements[i];
                    attribute = gl.getAttribLocation(program, ve.attributeName);
                    gl.enableVertexAttribArray(attribute);
                    gl.vertexAttribPointer(attribute, ve.numElem, gl.FLOAT, false, vertexDeclaration.stride, ve.offset);
                }

            },
            getAttributeLocation: function(program, attribute) {
                return gl.getAttributeLocation(program, attribute);
            },
            getUniformLocation: function(program, uniform) {
                return gl.getUniformLocation(program, uniform);
            },
            setUniformData: function(uniform, data) {
                gl.uniformMatrix4fv(uniform, false, data);
            },
            createBuffer: function() {
                return gl.createBuffer();
            },
            bindVertexBuffer: function(buffer) {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            },
            setVertexBufferData: function(buffer, data) {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            },
            bindIndexBuffer: function(buffer) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            },
            setIndexBufferData: function(buffer, data) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
            },
            setSize: function(width, height) {
                this.canvas.width = width;
                this.canvas.height = height;

                this.setViewport(0, 0, width, height);
            },
            setViewport: function(x, y, width, height) {
                this.viewportX = x !== undefined ? x : 0;
                this.viewportY = y !== undefined ? y : 0;
                this.viewportWidth = width !== undefined ? width : this.canvas.width;
                this.viewportHeight = height !== undefined ? height : this.canvas.height;

                gl.viewport(this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight);
            },
            setScissor: function(x, y, width, height) {
                gl.scissor(x, y, width, height);
            },
            enableScissorTest: function(enable) {
                if (enable) {
                    gl.enable(gl.SCISSOR_TEST); 
                } else {
                    gl.disable(gl.SCISSOR_TEST);
                }
            }
        };

        return GraphicsDevice;
    }
);
