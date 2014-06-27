define([
        'lodash',
        'core/uiTheme'
    ],
    function(
        _,
        UITheme
    ) {
        'use strict';

        var EditorUITheme = function(context) {
            UITheme.call(this, context);
        };

        EditorUITheme.prototype = _.create(UITheme.prototype, {
            constructor: EditorUITheme,

            /**
            *   This method loads the editor UI theme.
            *
            *   @method loadDefault
            *   @returns {undefined}
            */
            loadAssets: function() {
                var assetLibrary = this.context.getAssetLibrary();
                var device       = this.context.getGraphicsDevice();

                // Button Textures
                var buttonTexture       = assetLibrary.getTexture('assets/editor/ui/button.png');
                var buttonHoverTexture  = assetLibrary.getTexture('assets/editor/ui/button-hover.png');
                var buttonActiveTexture = assetLibrary.getTexture('assets/editor/ui/button-active.png');

                // Button Sprites
                this.button       = buttonTexture.getFullTextureSprite();
                this.buttonHover  = buttonHoverTexture.getFullTextureSprite();
                this.buttonActive = buttonActiveTexture.getFullTextureSprite();
            },
        });

        return EditorUITheme;
    }
);
