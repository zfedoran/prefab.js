define([
        'lodash',
        'components/uiElement',
        'math/vector4'
    ],
    function(
        _,
        UIElement,
        Vector4
    ) {
        'use strict';

        /**
        *   UIButton component class.
        *
        *   @class 
        *   @constructor
        */
        var UIButton = function(text, uiElementStyle) {
            UIElement.call(this, uiElementStyle);

            this.text = text;
        };

        UIButton.__name__ = 'UIButton';

        UIButton.prototype = _.create(UIElement.prototype, {
            constructor: UIButton,

            /**
            *   This method sets this button text to the provided string
            *
            *   @method setText
            *   @param {text}
            *   @returns {undefined}
            */
            setText: function(text) {
                this.text = text + '';
                this.setDirty(true);
            },

            /**
            *   This method handles input events for UIButtons
            *
            *   @method handleState
            *   @param {event}
            *   @returns {undefined}
            */
            handleState: function(event) {
                switch (this.state) {
                    case UIElement.STATE_NORMAL:
                        if (event === 'mouseenter') {
                            this.setState(UIElement.STATE_HOVER);
                        }
                        break;
                    case UIElement.STATE_ACTIVE:
                        if (event === 'mouseup') {
                            this.setState(UIElement.STATE_HOVER);
                        }
                        break;
                    case UIElement.STATE_HOVER:
                        if (event === 'mousedown') {
                            this.setState(UIElement.STATE_ACTIVE);
                        } else if (event === 'mouseleave') {
                            this.setState(UIElement.STATE_NORMAL);
                        }
                        break;
                }
            }
        });

        return UIButton;
    }
);
