define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var GUIElement = function(rect) {
            Component.call(this);

            this.boundingRect = rect;

            this.setDirty(true);
        };

        GUIElement.__name__ = 'GUIElement';

        GUIElement.prototype = _.create(Component.prototype, {
            constructor: GUIElement,

            hitTest: function(position) {
                return this.boundingRect.contains(position);
            }
        });

        return GUIElement;
    }
);
