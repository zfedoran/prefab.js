define([
        'math/vector4'
    ],
    function(
        Vector4
    ) {
        'use strict';

        var UIElementStyle = function(context) {
            this.context = context;

            this.normal     = null;
            this.active     = null;
            this.hover      = null;
            this.focus      = null;

            this.fontFamily = 'arial';
            this.fontSize   = 9;
            this.fontColor  = new Vector4(1, 1, 1, 1);
            this.padding    = new Vector4(0, 0, 0, 0);

            this.loadAssets();
        };

        UIElementStyle.prototype = {
            constructor: UIElementStyle,

            /**
            *   This method sets the normal state sprite for this UIElementStyle
            *
            *   @method setNormalStateSprite
            *   @param {sprite}
            *   @returns {undefined}
            */
            setNormalStateSprite: function(sprite) {
                this.normal = sprite;
            },

            /**
            *   This method returns the normal state sprite for this UIElementStyle
            *
            *   @method getNormalStateSprite
            *   @returns {sprite}
            */
            getNormalStateSprite: function() {
                return this.normal;
            },

            /**
            *   This method sets the active state sprite for this UIElementStyle
            *
            *   @method setActiveStateSprite
            *   @param {sprite}
            *   @returns {undefined}
            */
            setActiveStateSprite: function(sprite) {
                this.active = sprite;
            },

            /**
            *   This method returns the active state sprite for this UIElementStyle
            *
            *   @method getActiveStateSprite
            *   @returns {sprite}
            */
            getActiveStateSprite: function() {
                return this.active;
            },

            /**
            *   This method sets the hover state sprite for this UIElementStyle
            *
            *   @method setHoverStateSprite
            *   @param {sprite}
            *   @returns {undefined}
            */
            setHoverStateSprite: function(sprite) {
                this.hover = sprite;
            },

            /**
            *   This method returns the hover state sprite for this UIElementStyle
            *
            *   @method getHoverStateSprite
            *   @returns {sprite}
            */
            getHoverStateSprite: function() {
                return this.hover;
            },

            /**
            *   This method sets the focus state sprite for this UIElementStyle
            *
            *   @method setFocusStateSprite
            *   @param {sprite}
            *   @returns {undefined}
            */
            setFocusStateSprite: function(sprite) {
                this.focus = sprite;
            },

            /**
            *   This method returns the focus state sprite for this UIElementStyle
            *
            *   @method getFocusStateSprite
            *   @returns {sprite}
            */
            getFocusStateSprite: function() {
                return this.focus;
            },

            /**
            *   Abstract method for loading the texture assets required for
            *   this theme.
            *
            *   @method loadAssets
            *   @returns {undefined}
            */
            loadAssets: function() {
                throw 'UIElementStyle: loadAssets() function not implememented.';
            },
        };

        return UIElementStyle;
    }
);