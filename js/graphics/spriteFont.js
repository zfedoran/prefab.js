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
    
        var SpriteFont = function(device, options) {
            if (typeof device === 'undefined') {
                throw 'SpriteFont: cannot create a sprite font without a graphics device';
            }

            this.device = device;
            this.fontFamily = options.fontFamily;
            this.fontSize = options.fontSize;

            this.vspace = typeof options.vspace === 'undefined' ? 10 : options.vspace;
            this.hspace = typeof options.hspace === 'undefined' ? 0 : options.hspace;
            this.sprites = {};

            if (typeof options.characters === 'string') {
                this.characters = options.characters;
            } else {
                options.characters = options.characters || {};
                var i = options.characters.from || 32;
                var len = options.characters.to || 126;
                this.characters = '';
                for (i; i <= len; i++) {
                    this.characters += String.fromCharCode(i);
                }
            }

            this.initCanvas();
            this.initState();

            this.setTextureSize(5, 5, true);

            this._canvas.width = this._textureWidth;
            this._canvas.height = this._textureHeight;
            this._texture = new Texture(this.device, this._canvas);

            this.initState();

            this.generateTexture(this.textureWidth, this.textureHeight);
        };

        SpriteFont.prototype = {
            constructor: SpriteFont,

            initCanvas: function() {
                this._canvas = document.createElement('canvas');
                this._ctx = this._canvas.getContext('2d');
            },

            initState: function() {
                this._ctx.fillStyle = '#000';
                this._ctx.textAlign = 'left';
                this._ctx.textBaseline = 'top';
                this._ctx.font = this.fontSize + 'px ' + this.fontFamily;
            },

            getSprite: function(character) {
                return this.sprites[character];
            },

            getWidth: function() {
                return this._textureWidth;
            },

            getHeight: function() {
                return this._textureHeight;
            },

            setTextureSize: function(widthExp, heightExp, swap) {
                var widthChar, widthWord, widthTexture,
                    heightChar, heightWord, heightTexture;

                widthTexture = Math.pow(2, widthExp);
                heightTexture = Math.pow(2, heightExp);

                widthWord = 0;
                heightWord = this.fontSize + this.vspace;
                heightChar = this.fontSize + this.vspace;

                var i = 0, len = this.characters.length, character;
                var tryAgainWithLargerTexture = false;

                // check if all the characters fit the current texture size
                while (i <= len) {
                    character = this.characters.charAt(i);
                    widthChar = this._ctx.measureText(character).width;
                    widthChar += this.hspace;

                    if (widthWord + widthChar <= widthTexture) {
                        widthWord += widthChar;
                    } else if (heightWord + heightChar <= heightTexture) {
                        widthWord = 0;
                        widthWord += widthChar;
                        heightWord += heightChar;
                    } else {
                        tryAgainWithLargerTexture = true;
                        break;
                    }
                    i++;
                }

                // if the characters do not fit the current size, try again
                if (tryAgainWithLargerTexture) {
                    if (swap) {
                        widthExp++;
                    } else {
                        heightExp++;
                    }
                    swap = !swap;
                    this.setTextureSize(widthExp, heightExp, swap);
                } else {
                    this._textureHeight = heightTexture;
                    this._textureWidth = widthTexture;
                }
            },

            generateTexture: function() {
                var widthChar, widthWord, heightChar, heightWord;

                widthWord = 0;
                heightWord = this.fontSize + this.vspace;
                heightChar = this.fontSize + this.vspace;

                var i = 0, len = this.characters.length, character, coords;

                while (i <= len) {
                    character = this.characters.charAt(i);
                    widthChar = this._ctx.measureText(character).width;
                    widthChar += this.hspace;

                    if (widthWord + widthChar <= this._textureWidth) {
                        widthWord += widthChar;
                    } else if (heightWord + heightChar <= this._textureHeight) {
                        widthWord = 0;
                        widthWord += widthChar;
                        heightWord += heightChar;
                    } else {
                        throw 'SpriteFont: cannot fit all characters on the texture size provided';
                    }

                    coords = new Rectangle(widthWord - widthChar, 
                                           heightWord - heightChar, 
                                           widthChar, 
                                           heightChar);

                    this.sprites[character] = new Sprite(coords, this._texture);
                    this._ctx.fillText(character, coords.x + Math.ceil(this.hspace / 2), coords.y + Math.ceil(this.vspace / 2));
                    i++;
                }
            }
        };

        return SpriteFont;
    }
);
