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
        *   UIInput component class.
        *
        *   @class 
        *   @constructor
        */
        var UIInput = function(text, uiElementStyle) {
            UIElement.call(this, uiElementStyle);

            this.text = text;
        };

        UIInput.__name__ = 'UIInput';

        UIInput.prototype = _.create(UIElement.prototype, {
            constructor: UIInput,

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
                        if (event.type === 'mouseenter') {
                            this.setState(UIElement.STATE_HOVER);
                        }
                        break;
                    case UIElement.STATE_ACTIVE:
                        if (event.type === 'mouseup') {
                            this.setState(UIElement.STATE_FOCUS);
                        }
                        break;
                    case UIElement.STATE_HOVER:
                        if (event.type === 'mousedown') {
                            this.setState(UIElement.STATE_ACTIVE);
                        } else if (event.type === 'mouseleave') {
                            this.setState(UIElement.STATE_NORMAL);
                        }
                        break;
                }
            }
        });

        return UIInput;
    }
);
