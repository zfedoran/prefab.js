define([
        'core/component'
    ],
    function(
        Component
    ) {
    
        var GUILayer = function() {
            Component.call(this);
        };

        GUILayer.__name__ = 'GUILayer';

        GUILayer.prototype = Object.create(Component.prototype);

        GUILayer.prototype.constructor = GUILayer;

        return GUILayer;
    }
);
