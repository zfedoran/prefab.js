define([
        'lodash',
        'ui/uiElementStyle'
    ],
    function(
        _,
        UIElementStyle
    ) {
        'use strict';

        var UIEditorText = function(context) {
            UIElementStyle.call(this, context);

            this.setPadding(0, 0, 0, 0);
            this.setFontFamily('arial');
            this.setFontSize(9);
            this.setFontColor(0.8, 0.8, 0.8, 1);

            this.hover.fontColor.set(1,1,1,1);
            this.active.fontColor.set(0,0,0,1);
            this.focus.fontColor.set(0,0,0,1);
        };

        UIEditorText.prototype = _.create(UIElementStyle.prototype, {
            constructor: UIEditorText,

            /**
            *   This method loads the editor UI theme.
            *
            *   @method loadDefault
            *   @returns {undefined}
            */
            loadAssets: function() {
                var assetLibrary = this.context.getAssetLibrary();
                var device       = this.context.getGraphicsDevice();
            },
        });

        return UIEditorText;
    }
);
