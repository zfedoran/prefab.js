define([
        'lodash',
        'ui/components/uiElement'
    ],
    function(
        _,
        UIElement
    ) {
        'use strict';

        /**
        *   UIContainer component class.
        *
        *   @class 
        *   @constructor
        */
        var UIContainer = function(uiElementStyle) {
            UIElement.call(this, uiElementStyle);

            this.isHorizontalScrollEnabled = false;
            this.isVerticalScrollEnabled   = false;
        };

        UIContainer.__name__ = 'UIContainer';

        UIContainer.prototype = _.create(UIElement.prototype, {
            constructor: UIContainer,

            /**
            *   This method is called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            init: function(entity, context) {
            },

            /**
            *   This method is called when this component is removed from an
            *   entity.
            *
            *   @method uninitialize
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            uninitialize: function(entity, context) {
            }
        });

        return UIContainer;
    }
);
