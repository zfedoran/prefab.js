define([
        'lodash',
        'core/uiElementStyle'
    ],
    function(
        _,
        UIElementStyle
    ) {
        'use strict';

        var UIPrimaryButton = function(context) {
            UIElementStyle.call(this, context);

            this.fontFamily = 'arial';
            this.fontSize   = 9;
            this.fontColor.set(1, 1, 1, 1);

            this.padding.set(2, 10, 2, 10);
        };

        UIPrimaryButton.prototype = _.create(UIElementStyle.prototype, {
            constructor: UIPrimaryButton,

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
                var normal = assetLibrary.getSprite('assets/editor/ui/button.png');
                var active = assetLibrary.getSprite('assets/editor/ui/button-active.png');
                var hover  = assetLibrary.getSprite('assets/editor/ui/button-hover.png');

                // Initialize this UIElementStyle with the sprites
                this.setNormalStateSprite(normal);
                this.setActiveStateSprite(active);
                this.setHoverStateSprite(hover);
            },
        });

        return UIPrimaryButton;
    }
);
