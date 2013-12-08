define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'graphics/state',
        'graphics/shaderAttribute',
        'graphics/shaderUniform',
        'graphics/debugUtils'
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        Matrix4,
        GraphicsState,
        ShaderAttribute,
        ShaderUniform,
        __debugUtils
    ) {
        'use strict';

        var GraphicsDevice = function(width, height) {
            this.initCanvas();
            this.initWebGL();

            if (this.state.getContext()) {
                this.setSize(width, height);
                this.initDefaultState();
                this.initCapabilities();
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
                    var gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

                    var debug = false;
                    if (debug) {
                        var logGLCall = function(functionName, args) {
                            console.log('gl.' + functionName + '(' 
                                    + window.WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')');
                        };

                        gl = window.WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);
                    }

                    this.state = new GraphicsState(gl);
                } catch (error) {
                    console.error(error);
                }
            },
            initCapabilities: function() {
                var gl = this.state.getContext();

                this._maxTextures               = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS );
                this._maxVertexTextures         = gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
                this._maxTextureSize            = gl.getParameter( gl.MAX_TEXTURE_SIZE );
                this._maxCubemapSize            = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE );
                this._supportsVertexTextures    = ( this._maxVertexTextures > 0 );

                this._usedTextureUnits = 0;
            },
            initDefaultState: function() {
                var gl = this.state.getContext();

                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);

                //gl.enable( gl.BLEND );
                //gl.blendEquation( gl.FUNC_ADD );
                //gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

                gl.cullFace(gl.BACK);
                gl.enable(gl.CULL_FACE);

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            },
            clear: function(color, depth, stencil) {
                var gl = this.state.getContext();

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
                var gl = this.state.getContext();

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

                program.device = this;
                program.vsource = vsource;
                program.fsource = fsource;
                program.uniforms = {};
                program.attributes = {};

                var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
                var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

                var i, info, index;
                for (i = 0; i < numUniforms; i++) {
                    info = gl.getActiveUniform(program, i);
                    index = gl.getUniformLocation(program, info.name);
                    program.uniforms[info.name] = new ShaderUniform(program, info.name, info.type, index);
                }

                for (i = 0; i < numAttributes; i++) {
                    info = gl.getActiveAttrib(program, i);
                    index = gl.getAttribLocation(program, info.name);
                    program.attributes[info.name] = new ShaderAttribute(program, info.name, info.type, index);
                }

                return program;
            },
            bindShader: function(program) {
                this.state.setShader(program);
            },
            createBuffer: function() {
                var gl = this.state.getContext();
                return gl.createBuffer();
            },
            deleteBuffer: function(buffer) {
                var gl = this.state.getContext();
                return gl.deleteBuffer();
            },
            bindVertexDeclaration: function(vertexDeclaration) {
                this.state.setVertexDeclaration(vertexDeclaration);
            },
            bindVertexBuffer: function(buffer) {
                this.state.setVertexBuffer(buffer);
            },
            setVertexBufferData: function(buffer, data) {
                var gl = this.state.getContext();

                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
                buffer.length = data.length;
            },
            bindIndexBuffer: function(buffer) {
                this.state.setIndexBuffer(buffer);
            },
            setIndexBufferData: function(buffer, data) {
                var gl = this.state.getContext();

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
                buffer.length = data.length;
            },
            drawPrimitives: function(primitiveType, numVertices, offset) {
                var gl = this.state.getContext();

                this.applyState();
                gl.drawArrays(primitiveType, offset, numVertices);
            },
            drawIndexedPrimitives: function(primitiveType, numIndices, dataType, offset) {
                var gl = this.state.getContext();

                this.applyState();
                gl.drawElements(primitiveType, numIndices, dataType, offset);
            },
            setSize: function(width, height) {
                var gl = this.state.getContext();

                this.canvas.width = width;
                this.canvas.height = height;

                this.setViewport(0, 0, width, height);
            },
            setViewport: function(x, y, width, height) {
                var gl = this.state.getContext();

                this.viewportX = x !== undefined ? x : 0;
                this.viewportY = y !== undefined ? y : 0;
                this.viewportWidth = width !== undefined ? width : this.canvas.width;
                this.viewportHeight = height !== undefined ? height : this.canvas.height;

                gl.viewport(this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight);
            },
            setScissor: function(x, y, width, height) {
                var gl = this.state.getContext();

                gl.scissor(x, y, width, height);
            },
            enableScissorTest: function(enable) {
                var gl = this.state.getContext();

                if (enable) {
                    gl.enable(gl.SCISSOR_TEST); 
                } else {
                    gl.disable(gl.SCISSOR_TEST);
                }
            },
            getTextureUnit: function() {
                var currentTextureUnit = this._usedTextureUnits++;
                if (currentTextureUnit >= this._maxTextures) {
                    throw 'GraphicsDevice: trying to use ' + currentTextureUnit 
                        + ' texture units while this GPU supports only ' 
                        + this._maxTextures;
                }
                return currentTextureUnit;
            },
            applyState: function() {
                var gl = this.state.getContext();

                //get current state
                var currentShaderProgram      = this.state.getShader();
                var currentVertexBuffer       = this.state.getVertexBuffer();
                var currentVertexDeclaration  = this.state.getVertexDeclaration();
                var currentIndexBuffer        = this.state.getIndexBuffer();

                //set vertex buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, currentVertexBuffer);

                //set vertex declaration
                var i, al, ve, len = currentVertexDeclaration.length;
                for (i = 0; i < len; i++) {
                    ve = currentVertexDeclaration.elements[i];
                    al = gl.getAttribLocation(currentShaderProgram, ve.attribute);
                    gl.enableVertexAttribArray(al);
                    gl.vertexAttribPointer(al, ve.numElem, gl.FLOAT, false, currentVertexDeclaration.stride, ve.offset);
                }

                //bind index buffer
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, currentIndexBuffer);

                //set shader program
                gl.useProgram(currentShaderProgram);

                //apply shader uniforms
                var o, uniform;
                for (o in currentShaderProgram.uniforms) {
                    if (currentShaderProgram.uniforms.hasOwnProperty(o)) {
                        uniform = currentShaderProgram.uniforms[o];
                        uniform.apply();
                    }
                }

                this._usedTextureUnits = 0;
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
