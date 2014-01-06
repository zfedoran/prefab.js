define([
        'core/component'
    ],
    function(
        Component
    ) {
        'use strict';

        var Orbit = function(entity) {
            Component.call(this);

            this.state = Orbit.STATE_NONE;
        };

        Orbit.__name__ = 'Orbit';

        Orbit.prototype = Object.create(Component.prototype);

        Orbit.prototype.constructor = Orbit;

        Orbit.STATE_NONE    = 'none';
        Orbit.STATE_PAN     = 'pan';
        Orbit.STATE_ROTATE  = 'none';
        Orbit.STATE_ZOOM    = 'zoom';

        return Orbit;
    }
);
