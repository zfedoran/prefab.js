define([
        'lodash',
        'core/uiStyle'
    ],
    function(
        _,
        UIStyle
    ) {
        'use strict';

        var UIPrimaryButton = function(context) {
            UIStyle.call(this, context);

            this.fontFamily = 'arial';
            this.fontSize   = 9;
            this.fontColor.set(1, 1, 1, 1);

            this.paddingTop    = 2;
            this.paddingBottom = 0;
            this.paddingLeft   = 10;
            this.paddingRight  = 10;
        };

        UIPrimaryButton.prototype = _.create(UIStyle.prototype, {
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

                // Initialize this UIStyle with the sprites
                this.setNormalStateSprite(normal);
                this.setActiveStateSprite(active);
                this.setHoverStateSprite(hover);
            },
        });

        return UIPrimaryButton;
    }
);
