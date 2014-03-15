define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var Unwrap = function(entity) {
            Component.call(this);

            this.blockEntity  = entity;
        };

        Unwrap.__name__ = 'Unwrap';

        Unwrap.prototype = _.create(Component.prototype, {
            constructor: Unwrap
        });

        return Unwrap;
    }
);
