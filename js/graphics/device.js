define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'graphics/debugUtils'
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        Matrix4,
        __debugUtils
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

                    var debug = true;
                    if (debug) {
                        var logGLCall = function(functionName, args) {
                            console.log('gl.' + functionName + '(' 
                                    + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')');
                        };

                        gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);
                    }
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
            bindShader: function(program) {
                gl.useProgram(program);
            },
            bindVertexDeclaration: function(vertexDeclaration) {
                var i, ve;
                for (i = 0; i < vertexDeclaration.length; i++) {
                    ve = vertexDeclaration.elements[i];
                    gl.enableVertexAttribArray(ve.attributeLocation);
                    gl.vertexAttribPointer(ve.attributeLocation, ve.numElem, gl.FLOAT, false, vertexDeclaration.stride, ve.offset);
                }
            },
            getAttributeLocation: function(program, attribute) {
                return gl.getAttribLocation(program, attribute);
            },
            getUniformLocation: function(program, uniform) {
                return gl.getUniformLocation(program, uniform);
            },
            setUniformData: function(uniform, data) {
                if (data instanceof Vector2) {
                    gl.uniform2f(uniform, false, data.x, data.y);
                } else if (data instanceof Vector3) {
                    gl.uniform3f(uniform, false, data.x, data.y, data.z);
                } else if (data instanceof Vector4) {
                    gl.uniform4f(uniform, false, data.x, data.y, data.z, data.w);
                } else if (data instanceof Matrix4) {
                    gl.uniformMatrix4fv(uniform, false, data.elements);
                } else if (typeof data === 'number') {
                    gl.uniform1f(uniform, false, data);
                }
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
                buffer.length = data.length;
            },
            bindIndexBuffer: function(buffer) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            },
            setIndexBufferData: function(buffer, data) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
                buffer.length = data.length;
            },
            drawPrimitives: function(primitiveType, numVertices, offset) {
                gl.drawArrays(primitiveType, offset, numVertices);
            },
            drawIndexedPrimitives: function(primitiveType, numIndices, dataType, offset) {
                gl.drawElements(primitiveType, numIndices, dataType, offset);
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

        /* PrimitiveType */
        GraphicsDevice.POINTS                    = 0x0000;
        GraphicsDevice.LINES                     = 0x0001;
        GraphicsDevice.LINE_LOOP                 = 0x0002;
        GraphicsDevice.LINE_STRIP                = 0x0003;
        GraphicsDevice.TRIANGLES                 = 0x0004;
        GraphicsDevice.TRIANGLE_STRIP            = 0x0005;
        GraphicsDevice.TRIANGLE_FAN              = 0x0006;

        /* DataType */
        GraphicsDevice.BYTE                      = 0x1400;
        GraphicsDevice.UNSIGNED_BYTE             = 0x1401;
        GraphicsDevice.SHORT                     = 0x1402;
        GraphicsDevice.UNSIGNED_SHORT            = 0x1403;
        GraphicsDevice.INT                       = 0x1404;
        GraphicsDevice.UNSIGNED_INT              = 0x1405;
        GraphicsDevice.FLOAT                     = 0x1406;

        return GraphicsDevice;
    }
);
