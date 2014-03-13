define([
        'core/component'
    ],
    function(
        Component
    ) {
        'use strict';

        var Unwrap = function(entity) {
            Component.call(this);

            this.blockEntity  = entity;
        };

        Unwrap.__name__ = 'Unwrap';

        Unwrap.prototype = Object.create(Component.prototype);

        Unwrap.prototype.constructor = Unwrap;

        return Unwrap;
    }
);
