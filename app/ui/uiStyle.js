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
            this.context = context;

            this.background = null;

            this.fontFamily = 'arial';
            this.fontSize   = 9;
            this.fontColor  = new Vector4(1, 1, 1, 1);

            this.paddingTop    = 0;
            this.paddingBottom = 0;
            this.paddingRight  = 0;
            this.paddingLeft   = 0;
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
        };

        return UIStyle;
    }
);
