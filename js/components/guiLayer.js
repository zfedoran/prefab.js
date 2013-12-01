define([
        'core/component'
    ],
    function(
        Component
    ) {
        'use strict';
    
        var GUILayer = function(rect) {
            Component.call(this);

            this.boundingBox = rect;
        };

        GUILayer.__name__ = 'GUILayer';

        GUILayer.prototype = Object.create(Component.prototype);

        GUILayer.prototype.constructor = GUILayer;

        return GUILayer;
    }
);
