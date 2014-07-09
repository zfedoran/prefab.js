define([
        'lodash',
        'core/uiElementStyle'
    ],
    function(
        _,
        UIElementStyle
    ) {
        'use strict';

        var UIEditorInput = function(context) {
            UIElementStyle.call(this, context);

            this.setFontFamily('arial');
            this.setFontSize(9);
            this.setFontColor(0.8, 0.8, 0.8, 1);
            this.setPadding(2, 10, 0, 10);

            this.hover.fontColor.set(1,1,1,1);
            this.active.fontColor.set(0,0,0,1);
            this.focus.fontColor.set(0,0,0,1);

            this.active.paddingLeft  = 5;
            this.focus.paddingLeft   = 5;

            this.active.paddingRight = 15;
            this.focus.paddingRight  = 15;
        };

        UIEditorInput.prototype = _.create(UIElementStyle.prototype, {
            constructor: UIEditorInput,

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
                this.normal.background = assetLibrary.getSprite('assets/editor/ui/input.png');
                this.hover.background  = assetLibrary.getSprite('assets/editor/ui/input.png');
                this.active.background = assetLibrary.getSprite('assets/editor/ui/input-focus.png');
                this.focus.background  = assetLibrary.getSprite('assets/editor/ui/input-focus.png');
            },
        });

        return UIEditorInput;
    }
);
