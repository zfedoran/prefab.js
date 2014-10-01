define([
        'lodash',
        'ui/uiElementStyle'
    ],
    function(
        _,
        UIElementStyle
    ) {
        'use strict';

        var UIEditorButton = function(context) {
            UIElementStyle.call(this, context);

            this.setFontFamily('arial');
            this.setFontSize(9);
            this.setFontColor(1, 1, 1, 1);
            this.setPadding(2, 10, 0, 10);
        };

        UIEditorButton.prototype = _.create(UIElementStyle.prototype, {
            constructor: UIEditorButton,

            /**
            *   This method loads the editor UI theme.
            *
            *   @method loadDefault
            *   @returns {undefined}
            */
            loadAssets: function() {
                var assetLibrary = this.context.getAssetLibrary();
                var device       = this.context.getGraphicsDevice();

                // Load Sprites
                this.normal.background = assetLibrary.getSprite('assets/editor/ui/button.png');
                this.hover.background  = assetLibrary.getSprite('assets/editor/ui/button-hover.png');
                this.active.background = assetLibrary.getSprite('assets/editor/ui/button-active.png');
                this.focus.background  = assetLibrary.getSprite('assets/editor/ui/button.png');
            },
        });

        return UIEditorButton;
    }
);
