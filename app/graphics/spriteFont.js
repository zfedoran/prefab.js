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

            this.init();
        };

        SpriteFont.prototype = {
            constructor: SpriteFont,

            init: function() {
                this.initCanvas();
                this.initState();
                this.initCharWidth();
                this.initTextureSize();
                this.initCharBitmap();
            },

            initCanvas: function() {
                this._canvas = document.createElement('canvas');
                this._ctx    = this._canvas.getContext('2d');
            },

            initState: function() {
                this._ctx.fillStyle = 'black';
                this._ctx.textAlign = 'left';
                this._ctx.textBaseline = 'top';
                this._ctx.font = this.fontSize + 'px ' + this.fontFamily;
            },

            initCharWidth: function() {
                for (var i = 0; i <= this.charString.length; i++) {
                    var currentChar  = this.charString.charAt(i);
                    var currentWidth = this._ctx.measureText(currentChar).width;
                    this.charWidth = Math.max(this.charWidth, currentWidth);
                }
                this.charWidth += this.charPadding;
            },

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

                    /* TODO:
                     * - Get the kerning pairs
                     */
                }

                document.body.appendChild(this._canvas);
            },

            getCharWidth: function() {
                return this.charWidth;
            },

            getCharHeight: function() {
                return this.charHeight;
            },

            getCharKerning: function(c) {
                return this.kerningMap[c];
            },

            getCharSprite: function(c) {
                return this.spriteMap[c];
            }

        };

        return SpriteFont;
    }
);
