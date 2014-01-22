define([
        'core/component'
    ],
    function(
        Component
    ) {
        'use strict';

        var GUIElement = function(rect) {
            Component.call(this);

            this.boundingRect = rect;

            this.setDirty(true);
        };

        GUIElement.__name__ = 'GUIElement';

        GUIElement.prototype = Object.create(Component.prototype);

        GUIElement.prototype.constructor = GUIElement;

        GUIElement.prototype.hitTest = function(position) {
            return this.boundingRect.contains(position);
        };

        return GUIElement;
    }
);
