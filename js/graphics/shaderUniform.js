define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
        'graphics/texture',
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        Matrix4,
        Texture
    ) {

        var ShaderUniform = function(program, name, type, index) {
            var _program = program, _name = name, _type = type, _index = index;

            // data accessors
            this.getName = function() { return _name; };
            this.getType = function() { return _type; };
            this.getIndex = function() { return _index; };
            this.getProgram = function() { return _program; };

            // dirty flag helpers
            var _dirty = true;
            this.makeDirty = function() { _dirty = true; };
            this.isDirty = function() { return _dirty; };

            this.data = null;

            // get the graphics context
            var gl = _program.device.state.getContext();

            // set the correct data upload function
            var _upload1f = function() { 
                if (typeof this.data === 'number') {
                    gl.uniform1f(_index, false, this.data); 
                    _dirty = false;
                } else {
                    throw 'ShaderUniform: data type does not match the uniform type';
                }
            };
            var _upload2f = function() { 
                if (this.data instanceof Vector2) {
                    gl.uniform2f(_index, false, this.data.x, this.data.y); 
                    _dirty = false;
                } else {
                    throw 'ShaderUniform: data type does not match the uniform type';
                }
            };
            var _upload3f = function() { 
                if (this.data instanceof Vector3) {
                    gl.uniform3f(_index, false, this.data.x, this.data.y, this.data.z); 
                    _dirty = false;
                } else {
                    throw 'ShaderUniform: data type does not match the uniform type';
                }
            };
            var _upload4f = function() { 
                if (this.data instanceof Vector4) {
                    gl.uniform4f(_index, false, this.data.x, this.data.y, this.data.z, this.data.w); 
                    _dirty = false;
                } else {
                    throw 'ShaderUniform: data type does not match the uniform type';
                }
            };
            var _uploadMatrix4fv = function() { 
                if (this.data instanceof Matrix4) {
                    gl.uniformMatrix4fv(_index, false, this.data.elements); 
                    _dirty = false;
                } else {
                    throw 'ShaderUniform: data type does not match the uniform type';
                }
            };
            var _upload1i = function() { 
                if (this.data instanceof Texture) {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, this.data.getTextureObject());
                    gl.uniform1i(_index, 0); 
                    _dirty = false;
                } else {
                    throw 'ShaderUniform: data type does not match the uniform type';
                }
            };

            if (_type === ShaderUniform.FLOAT_VEC2) {
                this.upload = _upload2f;
            } else if (_type === ShaderUniform.FLOAT_VEC3) {
                this.upload = _upload3f;
            } else if (_type === ShaderUniform.FLOAT_VEC4) {
                this.upload = _upload4f;
            } else if (_type === ShaderUniform.FLOAT_MAT4) {
                this.upload = _uploadMatrix4fv;
            } else if (_type === ShaderUniform.FLOAT) {
                this.upload = _upload1f;
            } else if (_type === ShaderUniform.SAMPLER_2D) {
                this.upload = _upload1i;
            } else {
                throw 'ShaderUniform: unsupported uniform type ' + _type.toString(16) + ' found in shader program';
            }

        };

        ShaderUniform.prototype = {
            constructor: ShaderUniform,

            get: function() {
                return this.data; 
            },

            set: function(data) {
                this.data = data; 
                this.makeDirty(); 
            },

            apply: function() {
                if (this.isDirty()) {
                    this.upload();
                }
            }
        };

        ShaderUniform.BYTE                = 0x1400;
        ShaderUniform.UNSIGNED_BYTE       = 0x1401;
        ShaderUniform.SHORT               = 0x1402;
        ShaderUniform.UNSIGNED_SHORT      = 0x1403;
        ShaderUniform.INT                 = 0x1404;
        ShaderUniform.UNSIGNED_INT        = 0x1405;
        ShaderUniform.FLOAT               = 0x1406;

        ShaderUniform.FLOAT_VEC2          = 0x8B50;
        ShaderUniform.FLOAT_VEC3          = 0x8B51;
        ShaderUniform.FLOAT_VEC4          = 0x8B52;
        ShaderUniform.INT_VEC2            = 0x8B53;
        ShaderUniform.INT_VEC3            = 0x8B54;
        ShaderUniform.INT_VEC4            = 0x8B55;
        ShaderUniform.BOOL                = 0x8B56;
        ShaderUniform.BOOL_VEC2           = 0x8B57;
        ShaderUniform.BOOL_VEC3           = 0x8B58;
        ShaderUniform.BOOL_VEC4           = 0x8B59;
        ShaderUniform.FLOAT_MAT2          = 0x8B5A;
        ShaderUniform.FLOAT_MAT3          = 0x8B5B;
        ShaderUniform.FLOAT_MAT4          = 0x8B5C;
        ShaderUniform.SAMPLER_2D          = 0x8B5E;
        ShaderUniform.SAMPLER_CUBE        = 0x8B60;

        return ShaderUniform;
    }
);