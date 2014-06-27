define([
        'math/rectangle',
        'graphics/sprite'
    ],
    function(
        Rectangle,
        Sprite
    ) {
        'use strict';

        var _textureCount = 0;

        var Texture = function(device, image, options) {
            if (typeof device === 'undefined') {
                throw 'Texture: cannot create a texture without a graphics device';
            }

            this.device = device;
            this._id = _textureCount++;

            if (typeof image === 'string') {
                this._url = image;
                image = new Image();
                image.onload = (function() {
                    this._textureWidth  = image.naturalWidth;
                    this._textureHeight = image.naturalHeight;
                    this.setDirty(true);
                }).bind(this);
                image.src = this._url;
            }

            this._image = image;
            
            if (typeof options === 'undefined') {
                options = {};
            }

            this._textureWidth      = typeof options.width !== 'undefined' ? options.width : 0;
            this._textureHeight     = typeof options.height !== 'undefined' ? options.height : 0;
            this._textureTarget     = typeof options.target !== 'undefined' ? options.target : Texture.TEXTURE_2D;
            this._imageFormat       = typeof options.format !== 'undefined' ? options.format : Texture.RGBA;
            this._wrapS             = typeof options.wrapS !== 'undefined' ? options.wrapS : Texture.CLAMP_TO_EDGE;
            this._wrapT             = typeof options.wrapT !== 'undefined' ? options.wrapT : Texture.CLAMP_TO_EDGE;
            this._magFilter         = typeof options.magFilter !== 'undefined' ? options.magFilter : Texture.NEAREST;
            this._minFilter         = typeof options.minFilter !== 'undefined' ? options.minFilter : Texture.NEAREST;
            this._type              = typeof options.type !== 'undefined' ? options.type : Texture.UNSIGNED_BYTE;

            if (image instanceof HTMLCanvasElement) {
                this._textureWidth = image.width;
                this._textureHeight = image.height;
            } else if (image instanceof HTMLImageElement) {
                this._textureWidth = image.naturalWidth;
                this._textureHeight = image.naturalHeight;
            }

            this.setDirty(true);
        };

        Texture.prototype = {
            constructor: Texture,

            getFullTextureSprite: function() {
                return new Sprite(new Rectangle(0, 0, this._textureWidth, this._textureHeight), this);
            },

            getWidth: function() { return this._textureWidth; },

            getHeight: function() { return this._textureHeight; },

            setTextureSize: function(width, height) {
                this._textureWidth = width;
                this._textureHeight = height;
                this.setDirty(true);
            },

            getTextureTarget: function() {
                return this._textureTarget; 
            },

            getTextureObject: function() { 
                if (typeof this._textureObject === 'undefined') {
                    this.apply();
                }
                return this._textureObject; 
            },

            setType: function(value) { this._type = value; this.setDirty(true); },
            getType: function() { return this._type; },

            setImageFormat: function(imageFormat) {
                if (imageFormat) {
                    this._imageFormat = imageFormat;
                } else {
                    this._imageFormat = Texture.RGBA;
                }
                this.setDirty(true);
            },

            getImage: function() { return this._image; },
            setImage: function(img, format) {
                this._image = img;
                this.setImageFormat(format);
                this.setDirty(true);
            },

            setWrapS: function(value) { this._wrapS = value; this.setDirty(true); },
            setWrapT: function(value) { this._wrapT = value; this.setDirty(true); },
            getWrapT: function() { return this._wrapT; },
            getWrapS: function() { return this._wrapS; },

            setMinFilter: function(value) { this._minFilter = value; this.setDirty(true); },
            setMagFilter: function(value) { this._magFilter = value; this.setDirty(true); },
            getMinFilter: function() { return this._minFilter; },
            getMagFilter: function() { return this._magFilter; },

            isDirty: function() { return this._dirty; },
            setDirty: function(value) { this._dirty = value; },

            isImageReady: function(image) {
                if (image) {
                    if (image instanceof Image) {
                        if (image.complete) {
                            if (typeof image.naturalWidth !== 'undefined' && image.naturalWidth === 0) {
                                return false;
                            }
                            return true;
                        }
                    } 
                    if (image instanceof HTMLCanvasElement) {
                        return true;
                    } 
                    if (image instanceof Uint8Array) {
                        return true;
                    }
                }
            },

            applyFilterParameter: function() {
                var gl = this.device.state.getContext();

                var powerOfTwo = isPowerOf2(this._textureWidth) && isPowerOf2(this._textureHeight);
                if (!powerOfTwo) {
                    this.setWrapT(Texture.CLAMP_TO_EDGE);
                    this.setWrapS(Texture.CLAMP_TO_EDGE);

                    if (this._minFilter === Texture.LINEAR_MIPMAP_LINEAR ||
                        this._minFilter === Texture.LINEAR_MIPMAP_NEAREST) {
                        this.setMinFilter(Texture.LINEAR);
                    }
                }

                gl.texParameteri(this._textureTarget, gl.TEXTURE_MAG_FILTER, this._magFilter);
                gl.texParameteri(this._textureTarget, gl.TEXTURE_MIN_FILTER, this._minFilter);
                gl.texParameteri(this._textureTarget, gl.TEXTURE_WRAP_S, this._wrapS);
                gl.texParameteri(this._textureTarget, gl.TEXTURE_WRAP_T, this._wrapT);
            },

            generateMipmap: function() {
                var gl = this.device.state.getContext();

                if (this._minFilter === gl.NEAREST_MIPMAP_NEAREST ||
                    this._minFilter === gl.LINEAR_MIPMAP_NEAREST ||
                    this._minFilter === gl.NEAREST_MIPMAP_LINEAR ||
                    this._minFilter === gl.LINEAR_MIPMAP_LINEAR) {
                    gl.generateMipmap(this._textureTarget);
                }
            },

            apply: function() {
                if (this.isDirty()) {
                    var gl = this.device.state.getContext();

                    if (typeof this._textureObject !== 'undefined' && !this.isDirty()) {
                        gl.bindTexture(this._textureTarget, this._textureObject);
                    } else if (this.default_type) {
                        gl.bindTexture(this._textureTarget, null);
                    } else {
                        var image = this._image;
                        if (typeof image !== 'undefined') {
                            if (this.isImageReady(image)) {
                                if (!this._textureObject) {
                                    this._textureObject = gl.createTexture();
                                }

                                gl.bindTexture(this._textureTarget, this._textureObject);
                                //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

                                if (image instanceof Image) {
                                    this.setTextureSize(image.naturalWidth, image.naturalHeight);
                                    gl.texImage2D(this._textureTarget, 0, this._imageFormat, this._imageFormat, this._type, this._image);
                                } else if (image instanceof HTMLCanvasElement) {
                                    this.setTextureSize(image.width, image.height);
                                    gl.texImage2D(this._textureTarget, 0, this._imageFormat, this._imageFormat, this._type, this._image);
                                } else {
                                    throw 'Texture: unsupported image type ' + typeof image;
                                
                                }

                                this.applyFilterParameter();
                                this.generateMipmap();

                                this.setDirty(false);
                            } else {
                                gl.bindTexture(this._textureTarget, null);
                            }
                        } else if (this._textureWidth !== 0 && this._textureHeight !== 0) {
                            if (!this._textureObject) {
                                this._textureObject = gl.createTexture();
                            }
                            gl.bindTexture(this._textureTarget, this._textureObject);
                            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                            gl.texImage2D(this._textureTarget, 0, this._imageFormat, this._textureWidth, this._textureHeight, 0, this._imageFormat, this._imageFormat, this._type, null);

                            this.applyFilterParameter();
                            this.generateMipmap();

                            this.setDirty(false);
                        }
                    }
                }
            }
        };

        // format
        Texture.DEPTH_COMPONENT                 = 0x1902;
        Texture.ALPHA                           = 0x1906;
        Texture.RGB                             = 0x1907;
        Texture.RGBA                            = 0x1908;
        Texture.LUMINANCE                       = 0x1909;
        Texture.LUMINANCE_ALPHA                 = 0x190A;

        // filter mode
        Texture.LINEAR                          = 0x2601;
        Texture.NEAREST                         = 0x2600;
        Texture.NEAREST_MIPMAP_NEAREST          = 0x2700;
        Texture.LINEAR_MIPMAP_NEAREST           = 0x2701;
        Texture.NEAREST_MIPMAP_LINEAR           = 0x2702;
        Texture.LINEAR_MIPMAP_LINEAR            = 0x2703;

        // wrap mode
        Texture.CLAMP_TO_EDGE                   = 0x812F;
        Texture.REPEAT                          = 0x2901;
        Texture.MIRRORED_REPEAT                 = 0x8370;

        // target
        Texture.TEXTURE_2D                      = 0x0DE1;
        Texture.TEXTURE_CUBE_MAP                = 0x8513;
        Texture.TEXTURE_BINDING_CUBE_MAP        = 0x8514;
        Texture.TEXTURE_CUBE_MAP_POSITIVE_X     = 0x8515;
        Texture.TEXTURE_CUBE_MAP_NEGATIVE_X     = 0x8516;
        Texture.TEXTURE_CUBE_MAP_POSITIVE_Y     = 0x8517;
        Texture.TEXTURE_CUBE_MAP_NEGATIVE_Y     = 0x8518;
        Texture.TEXTURE_CUBE_MAP_POSITIVE_Z     = 0x8519;
        Texture.TEXTURE_CUBE_MAP_NEGATIVE_Z     = 0x851A;
        Texture.MAX_CUBE_MAP_TEXTURE_SIZE       = 0x851C;

        // type
        Texture.UNSIGNED_BYTE = 0x1401;
        Texture.FLOAT = 0x1406;

        function isPowerOf2(x) {
            return ((x !== 0) && ((x & (~x + 1)) === x));
        }

        return Texture;
    }
);
