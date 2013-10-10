define([
        'core/component'
    ],
    function(
        Component
    ) {
    
        var GUIText = function(text, font, size, color) {
            Component.call(this);

            this.content = content;
            this.font = font || 'monospace';
            this.fontSize = size || 10;
            this.color = color || '#fff';
        };

        GUIText.__name__ = 'GUIText';

        GUIText.prototype = Object.create(Component.prototype);

        GUIText.prototype.constructor = GUIText;

        return GUIText;
    }
);
