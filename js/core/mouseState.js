define([
        'math/vector2',
        'core/buttonState'
    ],
    function(
        Vector2,
        ButtonState
    ) {
        'use strict';

        var MouseState = function() {
            this.mousePosition = new Vector2();
            this.mouseWheel    = new Vector2();

            this.buttonLeft   = ButtonState.BUTTON_UP;
            this.buttonMiddle = ButtonState.BUTTON_UP;
            this.buttonRight  = ButtonState.BUTTON_UP;
        };

        MouseState.prototype = {
            constructor: MouseState,
        };

        return MouseState;
    }
);
