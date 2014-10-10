define([
        'math/rectangle',
        'graphics/device',
        'graphics/texture',
        'graphics/sprite'
    ],
    function(
        Rectangle,
        GraphicsDevice,
        Texture,
        Sprite
    ) {
        'use strict';
    
        /**
        *   SpriteFont class.
        *
        *   This class generates a bitmap font from a font definition. A 2D
        *   canvas is used to render the bitmap to a texture object.
        *
        *   @class 
        *   @param {device} Graphics device instance
        *   @param {options} Options to use for generating this spriteFont
        *   @constructor
        */
        var SpriteFont = function(device, options) {
            if (typeof device === 'undefined') {
                throw 'SpriteFont: cannot create a sprite font without a graphics device';
            }

            this.device     = device;
            this.fontFamily = options.fontFamily;
            this.fontSize   = options.fontSize;
            this.firstChar  = options._characterRangeFrom || 32;
            this.lastChar   = options._characterRangeTo || 126;

            this.charString = '';
            for (var i = this.firstChar; i <= this.lastChar; i++) {
                this.charString += String.fromCharCode(i);
            }

            this.charPadding = 5;
            this.charWidth   = 0;
            this.charHeight  = parseInt(this.fontSize) + this.charPadding;

            this.kerningMap = {};
            this.spriteMap  = {};

            this._canvas   = null;
            this._canvas3x = null;
            this._ctx      = null;
            this._texture  = null;

            this._hasSpaceChar = !this.charString.match(/ /);

            // Webkit does not provide sub pixel anti-aliasing
            this.subPixelAntiAliasingEnabled = typeof options._antiAlias === 'undefined' ? true : options._antiAlias;
            
            // Webkit is not very good at drawing white text on a black background inside a canvas
            this.invertColorsEnabled         = typeof options._antiAlias === 'undefined' ? true : options._invertColors;

            this.init();
        };

        SpriteFont.prototype = {
            constructor: SpriteFont,

            /**
            *   This method initializes the SpriteFont instance.
            *   (Called automatically)
            *
            *   @method init
            *   @returns {undefined}
            */
            init: function() {
                this.initCanvas();
                this.initState();
                this.initCharWidth();
                this.initTextureSize();
                this.initTextureBackground();
                this.initCharBitmap();
            },

            /**
            *   This method creates the 2D canvas required to render the bitmap
            *   font texture.
            *
            *   @method initCanvas
            *   @returns {undefined}
            */
            initCanvas: function() {
                this._canvas = document.createElement('canvas');
                this._ctx    = this._canvas.getContext('2d');
                document.body.appendChild(this._canvas);

                if (this.subPixelAntiAliasingEnabled) {
                    this._canvas3x = document.createElement('canvas');
                    this._ctx3x    = this._canvas3x.getContext('2d');
                }
            },

            /**
            *   This method initializes the 2D canvas context with the
            *   appropriate state.
            *
            *   @method initState
            *   @returns {undefined}
            */
            initState: function() {
                // Webkit seems to be better at drawing black text on a white
                // backgrounds in canvas elements.
                var foreground = 'white';
                if (this.invertColorsEnabled) {
                    foreground = 'black';
                } 

                this._ctx.fillStyle    = foreground;
                this._ctx.textAlign    = 'left';
                this._ctx.textBaseline = 'base';
                this._ctx.font         = this.fontSize + 'px ' + this.fontFamily;

                if (this.subPixelAntiAliasingEnabled) {
                    this._ctx3x.fillStyle    = foreground;
                    this._ctx3x.textAlign    = 'left';
                    this._ctx3x.textBaseline = 'base';
                    this._ctx3x.font         = this.fontSize + 'px ' + this.fontFamily;
                    this._ctx3x.scale(3,1);
                }
            },

            /**
            *   This method finds the widest character, and uses that size for
            *   the texture atlas grid.
            *
            *   @method initCharWidth
            *   @returns {undefined}
            */
            initCharWidth: function() {
                for (var i = 0; i <= this.charString.length; i++) {
                    var currentChar  = this.charString.charAt(i);
                    var currentWidth = this._ctx.measureText(currentChar).width;
                    this.charWidth   = Math.max(this.charWidth, currentWidth);
                }
                this.charWidth += this.charPadding;
            },

            /**
            *   This method finds an appropriate power of two texture size for
            *   the bitmap font texture.
            *
            *   @method initTextureSize
            *   @returns {undefined}
            */
            initTextureSize: function() {
                var total = this.charString.length 
                          * this.charWidth 
                          * this.charHeight;

                var widthExp  = 0,
                    heightExp = 0,
                    width     = 0,
                    height    = 0,
                    index     = 0;

                while (width * height < total) {
                    width  = Math.pow(2, widthExp);
                    height = Math.pow(2, heightExp);
                    widthExp  += index % 2; index++;
                    heightExp += index % 2;
                }

                this._canvas.width  = width;
                this._canvas.height = height;

                if (this.subPixelAntiAliasingEnabled) {
                    this._canvas3x.width  = width * 3;
                    this._canvas3x.height = height;
                }
            },

            /**
            *   This method fills the background of the canvas using the
            *   calculated width and height.
            *
            *   @method initTextureBackground
            *   @returns {undefined}
            */
            initTextureBackground: function() {
                var background = 'black';
                if (this.invertColorsEnabled) {
                    background = 'white';
                } 

                if (this.subPixelAntiAliasingEnabled) {
                    this._ctx3x.fillStyle = background;
                    this._ctx3x.fillRect(0, 0, this._canvas3x.width, this._canvas3x.height);
                } else {
                    this._ctx.fillStyle = background;
                    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
                }
            },

            /**
            *   This method draws the individual characters onto the bitmap
            *   font texture atlas.
            *
            *   @method initCharBitmap
            *   @returns {undefined}
            */
            initCharBitmap: function() {
                // Required for some strange reason
                this.initState();

                // Create the texture resource for this font
                this._texture = new Texture(this.device, this._canvas);

                // Calculate the max row width
                var max = Math.floor(this._canvas.width / this.charWidth) * this.charWidth;

                // Create the character bitmap
                for (var i = 0; i <= this.charString.length; i++) {
                    var currentChar  = this.charString.charAt(i);
                    var currentWidth = this._ctx.measureText(currentChar).width;

                    // Calculate the atlas position for the current character
                    var x   = (this.charWidth * i) % max;
                    var y   = Math.floor((this.charWidth * i) / max) * this.charHeight + this.charHeight;
                    
                    // Draw the character glyph
                    if (this.subPixelAntiAliasingEnabled) {
                        this._ctx3x.fillText(currentChar, x + this.charPadding, y);
                    } else {
                        this._ctx.fillText(currentChar, x + this.charPadding, y);
                    }

                    // Store kerning meta-data
                    this.kerningMap[currentChar] = currentWidth;

                    // Create the glyph sprite
                    var coords = new Rectangle(x + this.charPadding, y - this.charHeight + this.charPadding, currentWidth, this.charHeight);
                    this.spriteMap[currentChar] = new Sprite(coords, this._texture);
                }

                if (this.subPixelAntiAliasingEnabled) {
                    this.subPixelAntiAlias();
                }

                if (this.invertColorsEnabled) {
                    this.invertColors();
                }
            },

            /**
            *   This method inverts the canvas colors. Webkit seems to be
            *   better at drawing black text against white than white text
            *   against black.
            *
            *   @method invertColors
            *   @returns {undefined}
            */
            invertColors: function() {
                var width  = this._canvas.width;
                var height = this._canvas.height;
                var dp     = this._ctx.getImageData(0, 0, width, height);
                
                var index, x, y;
                
                for (y = 0; y < height; y++) {
                    for (x = 0; x < width; x++) {
                        index = (y * width + x) * 4;
                        dp.data[index + 0] = 255 - dp.data[index + 0];
                        dp.data[index + 1] = 255 - dp.data[index + 1];
                        dp.data[index + 2] = 255 - dp.data[index + 2];
                        dp.data[index + 3] = dp.data[index + 3];
                    }
                }

                this._ctx.putImageData(dp,0,0);
            },

            /**
            *   This method does software based anti-aliasing using the method
            *   described below.
            *
            *   http://stackoverflow.com/questions/4550926/subpixel-anti-aliased-text-on-html5s-canvas-element
            *
            *   @method subPixelAntiAlias
            *   @returns {undefined}
            */
            subPixelAntiAlias: function() {
                // Copies a 3:1 image to a 1:1 image, using LCD stripes
                var sc = this._ctx3x;
                var sw = this._canvas3x.width;
                var sh = this._canvas3x.height;
                var sp = sc.getImageData(0, 0, sw, sh);
                
                var dc = this._ctx;
                var dw = this._canvas.width;
                var dh = this._canvas.height;
                var dp = dc.getImageData(0, 0, dw, dh);
                
                var readIndex, writeIndex, r, g, b, a, x, y;
                
                var w1   = 0.34;
                var w2   = (1-w1) * 0.5;
                var w21  = w1 + w2;
                var w211 = w2 + w2 + w1;

                for(y = 0; y < dh; y++) {
                    for(x = 1; x < (dw-1); x++) {
                    
                        readIndex  = (y * sw + x * 3) * 4;
                        writeIndex = (y * dw + x) * 4;
                        
                        // r
                        dp.data[writeIndex + 0] = Math.round(w1 * sp.data[readIndex + 0] + w2 * (sp.data[readIndex - 4] + sp.data[readIndex +4]));
                        // g
                        dp.data[writeIndex + 1] = Math.round(w1 * sp.data[readIndex + 5] + w2 * (sp.data[readIndex + 1] + sp.data[readIndex +9])); 
                        // b
                        dp.data[writeIndex + 2] = Math.round(w1 * sp.data[readIndex + 10] + w2 * (sp.data[readIndex + 6] + sp.data[readIndex + 14])); 
                        // a
                        dp.data[writeIndex + 3] = Math.round(0.3333 * (w211 * sp.data[readIndex + 7] + w21* (sp.data[readIndex + 3] + sp.data[readIndex + 11]) + w2 * (sp.data[readIndex - 1] + sp.data[readIndex + 15])));
                    }
                }

                dc.putImageData(dp,0,0);
            },

            /**
            *   Get the uniform character width used by the texture atlas.
            *
            *   @method getCharWidth
            *   @returns {integer}
            */
            getCharWidth: function() {
                return this.charWidth;
            },

            /**
            *   Get the uniform character height used by the texture atlas.
            *
            *   @method getCharHeight
            *   @returns {integer}
            */
            getCharHeight: function() {
                return this.charHeight;
            },

            /**
            *   Get the width of a specific character.
            *
            *   @method getCharKerning
            *   @param {c}
            *   @returns {integer}
            */
            getCharKerning: function(c) {
                if (c === '\t' && this._hasSpaceChar) { return 4 * this.kerningMap[' ']; }
                return this.kerningMap[c];
            },

            /**
            *   Get the sprite object for a specific character.
            *
            *   @method getCharSprite
            *   @param {c}
            *   @returns {Sprite}
            */
            getCharSprite: function(c) {
                if (c === '\t' && this._hasSpaceChar) { return this.spriteMap[' ']; }
                return this.spriteMap[c];
            },

            /**
            *   This method measures the width of a single a line of text.
            *
            *   @method measureText
            *   @param {text}
            *   @returns {integrer}
            */
            measureText: function(text) {
                var width = 0;
                for (var i = 0; i <= text.length; i++) {
                    var currentChar = text.charAt(i);
                    width += this.kerningMap[currentChar];
                }
                return width;
            }
        };

        return SpriteFont;
    }
);
