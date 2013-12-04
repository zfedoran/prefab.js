define([
        'core/component'
    ],
    function(
        Component
    ) {
        'use strict';

        var GUIText = function(text, options) {
            Component.call(this);

            options = options || {
                fontFamily: 'monospace',
                fontSize: 10,
                lineHeight: 10,
                color: '#fff'
            };

            this.lineHeight = options.lineHeight || options.fontSize * 1.4 || 10;
            this.fontFamily = options.fontFamily || 'monospace';
            this.fontSize = options.fontSize || 10;
            this.color = options.color || '#fff';
            this.content = text;

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
