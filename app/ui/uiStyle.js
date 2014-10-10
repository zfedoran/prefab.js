define([
        'math/vector4'
    ],
    function(
        Vector4
    ) {
        'use strict';

        /**
        *   This abstract class defines the style for UI elements.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var UIStyle = function(context) {
            this.context       = context;

            this.background    = null;

            this.fontFamily    = 'arial';
            this.fontSize      = 9;
            this.fontColor     = new Vector4(1, 1, 1, 1);

            this.lineHeight    = 0;
            this.textAlign     = UIStyle.TEXT_ALIGN_LEFT;

            this.paddingTop    = 0;
            this.paddingBottom = 0;
            this.paddingRight  = 0;
            this.paddingLeft   = 0;

            this.overflow      = UIStyle.OVERFLOW_NONE;

            // The following properties change how the dynamic spriteFont is generated
            this._spriteFont         = null;
            this._characterRangeFrom = 32;
            this._characterRangeTo   = 126;
            this._antiAlias          = true;

            // Webkit seems to be better at rendering black font against white in the canvas element.
            this._invertColors       = true; 
        };

        UIStyle.prototype = {
            constructor: UIStyle,

            /**
            *   Abstract method for loading the texture assets required for
            *   this theme.
            *
            *   @method loadAssets
            *   @returns {undefined}
            */
            loadAssets: function() {
                throw 'UIStyle: loadAssets() function not implememented.';
            },

            /**
            *   This method returns the font-family name.
            *
            *   @method getFontName
            *   @returns {undefined}
            */
            getFontName: function() {
                return this.fontSize + 'px ' + this.fontFamily;
            },

            /**
            *   This method returns a unique identifier for the font-family
            *   plus other sprite font properties.
            *
            *   @method getFontID
            *   @returns {undefined}
            */
            getFontID: function() {
                return this.getFontName() + ':'
                     + this._characterRangeFrom + ':' 
                     + this._characterRangeTo + ':'
                     + this._antiAlias + ':' 
                     + this._invertColors;
            },

            /**
            *   This method returns the sprite font associated with this ui
            *   style.
            *
            *   @method getSpriteFont
            *   @returns {undefined}
            */
            getSpriteFont: function() {
                return this._spriteFont;
            },

            /**
            *   This method sets the sprite font associated with this ui style.
            *
            *   @method setSpriteFont
            *   @param {spriteFont}
            *   @returns {undefined}
            */
            setSpriteFont: function(spriteFont) {
                this._spriteFont = spriteFont;
            }
        };

        UIStyle.TEXT_ALIGN_LEFT     = 'left';
        UIStyle.TEXT_ALIGN_RIGHT    = 'right';
        UIStyle.TEXT_ALIGN_CENTER   = 'center';

        UIStyle.OVERFLOW_NONE       = 'none';
        UIStyle.OVERFLOW_HIDDEN     = 'hidden';
        UIStyle.OVERFLOW_SCROLL     = 'scroll';

        return UIStyle;
    }
);
