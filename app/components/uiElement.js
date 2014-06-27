define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        /**
        *   UIElement component class.
        *
        *   @class 
        *   @constructor
        */
        var UIElement = function() {
            Component.call(this);

            // TODO: Find a minimal set of properties that can be used to
            // express the size and position of UI elements.

            this.width = 'none'; // No auto sizing
            this.width = '100%'; // 100% of the parent container width
            this.width = 'auto'; // Width based on child content

            this.left = '30%'; // Position the left edge 30% of the parent left
            this.left = 'auto';
        };

        UIElement.__name__ = 'UIElement';

        UIElement.prototype = _.create(Component.prototype, {
            constructor: UIElement
        });

        UIElement.MODE_SIMPLE = 'simple';
        UIElement.MODE_SLICED = 'sliced';

        return UIElement;
    }
);
