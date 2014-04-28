define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'graphics/state',
        'graphics/shaderAttribute',
        'graphics/shaderUniform'
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        Matrix4,
        GraphicsState,
        ShaderAttribute,
        ShaderUniform
    ) {
        'use strict';

        /**
        *   The GraphicsDevice class performs primitive-based rendering,
        *   creates resources, handles system-level variables, and creates
        *   shaders.
        *
        *   @class 
        *   @param {width} The width of the WebGL context to create
        *   @param {height} The height of the WebGL context to create
        */
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

            /**
            *   This method creates and appends the canvas DOM element required
            *   in order to obtain a WebGL context.
            *
            *   @method initCanvas
            *   @returns {undefined}
            */
            initCanvas: function() {
                this.canvas = document.createElement('canvas');
                document.body.appendChild(this.canvas);
            },
            
            /**
            *   This method obtains the WebGL context from a previously created
            *   canvas DOM element.
            *
            *   @method initWebGL
            *   @returns {undefined}
            */
            initWebGL: function() {
                try {
                    var gl = this.canvas.getContext('webgl', {antialias: false}) 
                          || this.canvas.getContext('experimental-webgl', {antialias: false});

                    this.state = new GraphicsState(gl);
                } catch (error) {
                    console.error(error);
                }
            },

            /**
            *   This method adds debugging output to the current graphics
            *   context.
            *
            *   @method initDebugUtils
            *   @returns {undefined}
            */
            initDebugUtils: function() {
                var self = this;
                var gl   = this.state.getContext();

                requirejs(['graphics/debugUtils'], function(__debugUtils) {
                    var logGLCall = function(functionName, args) {
                        console.log('gl.' + functionName + '(' 
                                          + window.WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')');
                    };

                    var debugContext = window.WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);
                    self.state.setContext(debugContext);
                });
            },
            
            /**
            *   This method finds the capabilities of the current graphics
            *   hardware.
            *
            *   @method initCapabilities
            *   @returns {undefined}
            */
            initCapabilities: function() {
                var gl = this.state.getContext();

                this._maxTextures            = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
                this._maxVertexTextures      = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
                this._maxTextureSize         = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                this._maxCubemapSize         = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
                this._supportsVertexTextures = (this._maxVertexTextures > 0);

                this._usedTextureUnits = 0;
            },
            
            /**
            *   This method initializes a default clear color, enables depth
            *   testing, enables alpha blending, and enables backface culling.
            *
            *   @method initDefaultState
            *   @returns {undefined}
            */
            initDefaultState: function() {
                var gl = this.state.getContext();

                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);

                //gl.enable( gl.BLEND );
                //gl.blendEquation( gl.FUNC_ADD );
                //gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

                //gl.cullFace(gl.BACK);
                //gl.enable(gl.CULL_FACE);

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            },
            
            /**
            *   This method clears the resource buffers.
            *
            *   @method clear
            *   @param {color} clear color value
            *   @param {depth} clear depth value
            *   @param {stencil} clear stencil value
            *   @returns {undefined}
            */
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
            
            /**
            *   This method compiles a full shader program consisting of
            *   vertex, and fragment shader source code.
            *
            *   @method compileShader
            *   @param {vsource} The vertex shader source code string
            *   @param {fsource} The fragment shader source code string
            *   @returns {WebGLProgram}
            */
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
            
            /**
            *   This method applies a WebGLProgram to the current context.
            *
            *   @method bindShader
            *   @param {program} WebGLProgram reference
            *   @returns {undefined}
            */
            bindShader: function(program) {
                this.state.setShader(program);
            },
            
            /**
            *   Create a WebGLBuffer object and initialize it with a buffer
            *   object name.
            *
            *   @method createBuffer
            *   @returns {WebGLBuffer}
            */
            createBuffer: function() {
                var gl = this.state.getContext();
                return gl.createBuffer();
            },
            
            /**
            *   Delete the buffer object contained in the passed WebGLBuffer.
            *   If the buffer has already been deleted the call has no effect.
            *   Note that the buffer object will be deleted when the
            *   WebGLBuffer object is destroyed. This method merely gives the
            *   author greater control over when the buffer object is
            *   destroyed.
            *
            *   @method deleteBuffer
            *   @param {buffer} WebGLBuffer reference
            *   @returns {undefined}
            */
            deleteBuffer: function(buffer) {
                var gl = this.state.getContext();
                return gl.deleteBuffer(buffer);
            },
            
            /**
            *   Binds a VertexDeclaration reference to the current render
            *   state.
            *
            *   @method bindVertexDeclaration
            *   @param {vertexDeclaration} Instance of VertexDeclaration class
            *   @returns {undefined}
            */
            bindVertexDeclaration: function(vertexDeclaration) {
                this.state.setVertexDeclaration(vertexDeclaration);
            },
            
            /**
            *   Binds a WebGLBuffer reference to the current render state.
            *
            *   @method bindVertexBuffer
            *   @param {buffer} WebGLBuffer
            *   @returns {undefined}
            */
            bindVertexBuffer: function(buffer) {
                this.state.setVertexBuffer(buffer);
            },
            
            /**
            *   Writes data to the WebGLBuffer reference
            *
            *   @method setVertexBufferData
            *   @param {buffer} WebGLBuffer
            *   @param {data} Typed array of data to write to the WebGLBuffer
            *   (usually Float32Array).
            *   @returns {undefined}
            */
            setVertexBufferData: function(buffer, data) {
                var gl = this.state.getContext();

                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
                buffer.length = data.length;
            },
            
            /**
            *   Binds a WebGLBuffer reference to the current render state.
            *
            *   @method bindIndexBuffer
            *   @param {buffer}
            *   @returns {undefined}
            */
            bindIndexBuffer: function(buffer) {
                this.state.setIndexBuffer(buffer);
            },
            
            /**
            *   Writes data to the WebGLBuffer reference
            *
            *   @method setIndexBufferData
            *   @param {buffer} WebGLBuffer
            *   @param {data} Typed array of data to write to the WebGLBuffer
            *   (usually Int16Array).
            *   @returns {undefined}
            */
            setIndexBufferData: function(buffer, data) {
                var gl = this.state.getContext();

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
                buffer.length = data.length;
            },
            
            /**
            *   Renders a sequence of non-indexed geometric primitives of the
            *   specified type from the current set of data input streams.
            *
            *   @method drawPrimitives
            *   @param {primitiveType} Primitive type to render
            *   @param {numVertices} The number of verticies to render
            *   @param {offset} The vertex array offset at which to start
            *   rendering.
            *   @returns {undefined}
            */
            drawPrimitives: function(primitiveType, numVertices, offset) {
                var gl = this.state.getContext();

                this.applyState();
                gl.drawArrays(primitiveType, offset, numVertices);
            },
            
            /**
            *   Renders the specified geometric primitive, based on indexing
            *   into an array of vertices.
            *
            *   @method drawIndexedPrimitives
            *   @param {primitiveType} Primitive type to render
            *   @param {numIndices} The number of indices to render
            *   @param {dataType} Index data type (usually GraphicsDevice.UNSIGNED_SHORT)
            *   @param {offset} The index buffer offset at which to start rendering
            *   @returns {undefined}
            */
            drawIndexedPrimitives: function(primitiveType, numIndices, dataType, offset) {
                var gl = this.state.getContext();

                this.applyState();
                gl.drawElements(primitiveType, numIndices, dataType, offset);
            },
            
            /**
            *   This method returns the current canvas width.
            *
            *   @method getWidth
            *   @returns {width}
            */
            getWidth: function() {
                return this.canvas.width;
            },
            
            /**
            *   This method returns the current canvas height.
            *
            *   @method getHeight
            *   @returns {height}
            */
            getHeight: function() {
                return this.canvas.height;
            },
            
            /**
            *   This method sets the width and height of the current canvas and
            *   sets the context viewport to match these dimensions.
            *
            *   @method setSize
            *   @param {width}
            *   @param {height}
            *   @returns {undefined}
            */
            setSize: function(width, height) {
                var gl = this.state.getContext();

                this.canvas.width = width;
                this.canvas.height = height;

                this.setViewport(0, 0, width, height);
            },
            
            /**
            *   This method sets the context viewport position and size.
            *
            *   OpenGL manages a rectangular viewport as part of its state
            *   which defines the placement of the rendering results in the
            *   drawing buffer. Upon creation of WebGL context context, the
            *   viewport is initialized to a rectangle with origin at (0, 0)
            *   and width and height equal to the canvas element.
            *
            *   @method setViewport
            *   @param {x}
            *   @param {y}
            *   @param {width}
            *   @param {height}
            *   @returns {undefined}
            */
            setViewport: function(x, y, width, height) {
                var gl = this.state.getContext();

                y = this.canvas.height - y - height;

                this.viewportX = x !== undefined ? x : 0;
                this.viewportY = y !== undefined ? y : 0;
                this.viewportWidth = width !== undefined ? width : this.canvas.width;
                this.viewportHeight = height !== undefined ? height : this.canvas.height;

                gl.viewport(this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight);
            },
            
            /**
            *   This method sets the scissor test region.
            *
            *   The scissor region defines a rectangle which constrains
            *   drawing. When the scissor test is enabled only pixels that lie
            *   within the scissor box can be modified by drawing commands.
            *   When enabled drawing can only occur inside the intersection of
            *   the viewport, canvas area and the scissor box. When the scissor
            *   test is not enabled drawing can only occur inside the
            *   intersection of the viewport and canvas area.
            *
            *   @method setScissor
            *   @param {x}
            *   @param {y}
            *   @param {width}
            *   @param {height}
            *   @returns {undefined}
            */
            setScissor: function(x, y, width, height) {
                var gl = this.state.getContext();

                gl.scissor(x, y, width, height);
            },
            
            /**
            *   This method sets the scissor test state.
            *
            *   @method enableScissorTest
            *   @param {enable} Boolean value for whether scissor test should
            *   be enabled or disabled.
            *   @returns {undefined}
            */
            enableScissorTest: function(enable) {
                var gl = this.state.getContext();

                if (enable) {
                    gl.enable(gl.SCISSOR_TEST); 
                } else {
                    gl.disable(gl.SCISSOR_TEST);
                }
            },
            
            /**
            *   This method returns a new texture unit reference. An error will
            *   be thrown when attempting to request more texture units than
            *   the number supported by the graphics hardware.
            *
            *   @method getTextureUnit
            *   @returns {undefined}
            */
            getTextureUnit: function() {
                var currentTextureUnit = this._usedTextureUnits++;
                if (currentTextureUnit >= this._maxTextures) {
                    throw 'GraphicsDevice: trying to use ' + currentTextureUnit 
                        + ' texture units while this GPU supports only ' 
                        + this._maxTextures;
                }
                return currentTextureUnit;
            },
            
            /**
            *   This method applies the current graphics state to the graphics
            *   hardware.
            *
            *   @method applyState
            *   @returns {undefined}
            */
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
