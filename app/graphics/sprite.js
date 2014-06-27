define([
        'math/rectangle'
    ],
    function(
        Rectangle
    ) {
        'use strict';

        var Sprite = function(rect, texture) {
            this.texture = texture;
            this.x       = rect.x;
            this.y       = rect.y;
            this.width   = rect.width;
            this.height  = rect.height;

            var textureWidth  = texture.getWidth();
            var textureHeight = texture.getHeight();
            this._uvs = new Rectangle(
                this.x / textureWidth,
                this.y / textureHeight,
                this.width / textureWidth,
                this.height / textureHeight
            );
        };

        Sprite.prototype = {
            constructor: Sprite,

            getTexture: function() {
                return this.texture;
            },

            getUCoordinate: function() {
                return this._uvs.x;
            },
            
            getVCoordinate: function() {
                return this._uvs.y;
            },
            
            getUVWidth: function() {
                return this._uvs.width;
            },
            
            getUVHeight: function() {
                return this._uvs.height;
            }
        };

        return Sprite;
    }
);
