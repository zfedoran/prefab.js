define([
        'core/uiStyle'
    ],
    function(
        UIStyle
    ) {
        'use strict';

        /**
        *   This abstract class defines the style for UI elements.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var UIElementStyle = function(context) {
            this.context = context;

            this.normal = new UIStyle(context);
            this.hover  = new UIStyle(context);
            this.active = new UIStyle(context);
            this.focus  = new UIStyle(context);

            this.loadAssets();
        };

        UIElementStyle.prototype = {
            constructor: UIElementStyle,

            /**
            *   This method sets the padding for all states of this UI element
            *   style.
            *
            *   @method setPadding
            *   @param {top}
            *   @param {right}
            *   @param {bottom}
            *   @param {left}
            *   @returns {undefined}
            */
            setPadding: function(top, right, bottom, left) {
                this.normal.paddingTop    = top;
                this.hover.paddingTop     = top;
                this.active.paddingTop    = top;
                this.focus.paddingTop     = top;

                this.normal.paddingRight  = right;
                this.hover.paddingRight   = right;
                this.active.paddingRight  = right;
                this.focus.paddingRight   = right;

                this.normal.paddingBottom = bottom;
                this.hover.paddingBottom  = bottom;
                this.active.paddingBottom = bottom;
                this.focus.paddingBottom  = bottom;

                this.normal.paddingLeft   = left;
                this.hover.paddingLeft    = left;
                this.active.paddingLeft   = left;
                this.focus.paddingLeft    = left;
            },

            /**
            *   This method sets the font color for all states of this UI
            *   element style.
            *
            *   @method setFontColor
            *   @param {color}
            *   @returns {undefined}
            */
            setFontColor: function(r, g, b, a) {
                this.normal.fontColor.set(r, g, b, a);
                this.focus.fontColor.set(r, g, b, a);
                this.active.fontColor.set(r, g, b, a);
                this.hover.fontColor.set(r, g, b, a);
            },

            /**
            *   This method sets the font family for all states of this UI
            *   element style.
            *
            *   @method setFontFamily
            *   @param {family}
            *   @returns {undefined}
            */
            setFontFamily: function(family) {
                this.normal.fontFamily = family;
                this.hover.fontFamily  = family;
                this.active.fontFamily = family;
                this.focus.fontFamily  = family;
            },

            /**
            *   This method sets the font size for all states of this UI
            *   element style.
            *
            *   @method setFontSize
            *   @param {size}
            *   @returns {undefined}
            */
            setFontSize: function(size) {
                this.normal.fontSize = size;
                this.hover.fontSize  = size;
                this.active.fontSize = size;
                this.focus.fontSize  = size;
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
