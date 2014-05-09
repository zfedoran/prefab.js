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
        *   @param {family} Font family to be used
        *   @param {size}   Font size to be used
        *   @param {first}  Integer value of the first character that is part of this bitmap font
        *   @param {last}   Integer value of the last character that is part of this bitmap font
        *   @constructor
        */
        var SpriteFont = function(device, family, size, first, last) {
            if (typeof device === 'undefined') {
                throw 'SpriteFont: cannot create a sprite font without a graphics device';
            }
            this.device     = device;
            this.fontFamily = family;
            this.fontSize   = size;
            this.firstChar  = first || 9;
            this.lastChar   = last || 126;

            this.charString = '';
            for (var i = this.firstChar; i <= this.lastChar; i++) {
                this.charString += String.fromCharCode(i);
            }

            this.charPadding = 5;
            this.charWidth   = 0;
            this.charHeight  = parseInt(this.fontSize) + this.charPadding;

            this.kerningMap = {};
            this.spriteMap  = {};

            this._canvas  = null;
            this._ctx     = null;
            this._texture = null;

            this._hasSpaceChar = !this.charString.match(/ /);

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
            },

            /**
            *   This method initializes the 2D canvas context with the
            *   appropriate state.
            *
            *   @method initState
            *   @returns {undefined}
            */
            initState: function() {
                this._ctx.fillStyle = 'black';
                this._ctx.textAlign = 'left';
                this._ctx.textBaseline = 'top';
                this._ctx.font = this.fontSize + 'px ' + this.fontFamily;
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
                    this.charWidth = Math.max(this.charWidth, currentWidth);
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
                this._ctx.font = this.fontSize + 'px ' + this.fontFamily;

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
                    this._ctx.fillText(currentChar, x + this.charPadding, y);

                    // Store kerning meta-data
                    this.kerningMap[currentChar] = currentWidth;

                    // Create the glyph sprite
                    var coords = new Rectangle(x + this.charPadding, y - this.charHeight + this.charPadding, currentWidth, this.charHeight);
                    this.spriteMap[currentChar] = new Sprite(coords, this._texture);
                }
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
