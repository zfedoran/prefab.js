define([
        'lodash',
        'core/component',
        'core/mouseState',
        'core/buttonState',
        'math/vector2'
    ],
    function(
        _,
        Component,
        MouseState,
        ButtonState,
        Vector2
    ) {
        'use strict';

        var InputMouse = function() {
            Component.call(this);

            this.prevState = new MouseState();
            this.currState = new MouseState();
        };

        InputMouse.__name__ = 'InputMouse';

        InputMouse.prototype = _.create(Component.prototype, {
            constructor: InputMouse,

            hasClickEvent: function(button) {
                return this.hasButtonUpEvent(button);
            },

            hasButtonUpEvent: function(button) {
                if (button === InputMouse.BUTTON_RIGHT) {
                    return (this.prevState.buttonRight === ButtonState.BUTTON_DOWN) &&
                           (this.currState.buttonRight === ButtonState.BUTTON_UP);
                } else if (button === InputMouse.BUTTON_LEFT) {
                    return (this.prevState.buttonLeft === ButtonState.BUTTON_DOWN) &&
                           (this.currState.buttonLeft === ButtonState.BUTTON_UP);
                } else if (button === InputMouse.BUTTON_MIDDLE) {
                    return (this.prevState.buttonMiddle === ButtonState.BUTTON_DOWN) &&
                           (this.currState.buttonMiddle === ButtonState.BUTTON_UP);
                } 
                return this.hasButtonUpEvent(InputMouse.BUTTON_RIGHT) 
                    && this.hasButtonUpEvent(InputMouse.BUTTON_LEFT)
                    && this.hasButtonUpEvent(InputMouse.BUTTON_MIDDLE);
            },

            hasButtonDownEvent: function(button) {
                if (button === InputMouse.BUTTON_RIGHT) {
                    return (this.prevState.buttonRight === ButtonState.BUTTON_UP) &&
                           (this.currState.buttonRight === ButtonState.BUTTON_DOWN);
                } else if (button === InputMouse.BUTTON_LEFT) {
                    return (this.prevState.buttonLeft === ButtonState.BUTTON_UP) &&
                           (this.currState.buttonLeft === ButtonState.BUTTON_DOWN);
                } else if (button === InputMouse.BUTTON_MIDDLE) {
                    return (this.prevState.buttonMiddle === ButtonState.BUTTON_UP) &&
                           (this.currState.buttonMiddle === ButtonState.BUTTON_DOWN);
                } 
                return this.hasButtonDownEvent(InputMouse.BUTTON_RIGHT) 
                    && this.hasButtonDownEvent(InputMouse.BUTTON_LEFT)
                    && this.hasButtonDownEvent(InputMouse.BUTTON_MIDDLE);
            },

            hasScrollEvent: function() {
                return !this.prevState.mouseWheel.equals(this.currState.mouseWheel);
            },

            hasMoveEvent: function() {
                return !this.prevState.mousePosition.equals(this.currState.mousePosition);
            }
        });

        InputMouse.BUTTON_RIGHT  = 'right';
        InputMouse.BUTTON_LEFT   = 'left';
        InputMouse.BUTTON_MIDDLE = 'middle';

        return InputMouse;
    }
);
