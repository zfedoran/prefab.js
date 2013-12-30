define([
        'core/component'
    ],
    function(
        Component
    ) {
        'use strict';

        var GUIText = function(text) {
            Component.call(this);

            this.content = text;
            this.lineHeight = 20;
            this.fontFamily = 'monospace';
            this.fontSize = 10;
            this.color = '#000';

            this.setDirty(true);
        };

        GUIText.__name__ = 'GUIText';

        GUIText.prototype = Object.create(Component.prototype);

        GUIText.prototype.constructor = GUIText;

        GUIText.prototype.getFontStyle = function() {
            return this.fontSize + 'px ' + this.fontFamily;
        };

        return GUIText;
    }
);
