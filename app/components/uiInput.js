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

            this._cursorPosition   = 0;
            this._cursorBlinkTime  = 0;
            this._cursorBlinkDelay = 1;
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
                        if (event === 'mouseenter') {
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
                    case UIElement.STATE_ACTIVE:
                        if (event === 'mouseup') {
                            this.setState(UIElement.STATE_FOCUS);
                        }
                        break;
                    case UIElement.STATE_FOCUS:
                        if (event === 'focus') {
                            this.setState(UIElement.STATE_NORMAL);
                        }
                        break;
                }
            },

            /**
            *   This method adds time to the cursor clock.
            *
            *   @method addCursorTime
            *   @param {elapsed}
            *   @returns {undefined}
            */
            addCursorTime: function(elapsed) {
                if (this.hasFocusState()) {
                    this._cursorBlinkTime += elapsed;
                    if (this._cursorBlinkTime > this._cursorBlinkDelay) {
                        this._cursorBlinkTime = 0;
                    }
                }
            },

            /**
            *   Check if the cursor for this UIInput component is visible.
            *
            *   @method isCursorVisible
            *   @returns {undefined}
            */
            isCursorVisible: function() {
                return this.hasFocusState() 
                    && this._cursorBlinkTime > (this._cursorBlinkDelay / 2);
            }
        });

        return UIInput;
    }
);
