define([
    ],
    function(
    ) {
        'use strict';

        var UITheme = function(context) {
            this.context = context;

            this.loadAssets();
        };

        UITheme.prototype = {
            constructor: UITheme,

            /**
            *   Abstract method for loading the texture assets required for
            *   this theme.
            *
            *   @method loadAssets
            *   @returns {undefined}
            */
            loadAssets: function() {
                throw 'UITheme: loadAssets() function not implememented.';
            },
        };

        return UITheme;
    }
);
