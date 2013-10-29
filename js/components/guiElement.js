define([
        'core/component'
    ],
    function(
        Component
    ) {

        var GUIElement = function(rect) {
            Component.call(this);

            this.boundingBox = rect;
            this.setDirty(true);
        };

        GUIElement.__name__ = 'GUIElement';

        GUIElement.prototype = Object.create(Component.prototype);

        GUIElement.prototype.constructor = GUIElement;

        GUIElement.prototype.hitTest = function(position) {
            return this.boundingBox.contains(position);
        };

        return GUIElement;
    }
);
