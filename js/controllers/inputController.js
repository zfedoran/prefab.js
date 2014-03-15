define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'core/buttonState',
        'core/mouseState'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller,
        ButtonState,
        MouseState
    ) {
        'use strict';

        var InputController = function(context) {
            Controller.call(this, context, ['InputMouse']);

            this.mouseState = new MouseState();
        };

        InputController.prototype = _.create(Controller.prototype, {
            constructor: InputController,

            onMouseMove: function(evt) {
                this.mouseState.mousePosition.x = evt.pageX;
                this.mouseState.mousePosition.y = evt.pageY;
            },

            onMouseDown: function(evt) {
                if (evt.button === 0) {
                    this.mouseState.buttonLeft = ButtonState.BUTTON_DOWN;
                } else if (evt.button === 1) {
                    this.mouseState.buttonMiddle = ButtonState.BUTTON_DOWN;
                } else {
                    this.mouseState.buttonRight = ButtonState.BUTTON_DOWN;
                }
            },

            onMouseUp: function(evt) {
                if (evt.button === 0) {
                    this.mouseState.buttonLeft = ButtonState.BUTTON_UP;
                } else if (evt.button === 1) {
                    this.mouseState.buttonMiddle = ButtonState.BUTTON_UP;
                } else {
                    this.mouseState.buttonRight = ButtonState.BUTTON_UP;
                }
            },

            onMouseWheel: function(evt) {
                this.mouseState.mouseWheel.x = evt.originalEvent.wheelDeltaX;
                this.mouseState.mouseWheel.y = evt.originalEvent.wheelDeltaY;
            },

            onMouseLeave: function(evt) {
                this.mouseState.buttonLeft = ButtonState.BUTTON_UP;
                this.mouseState.buttonMiddle = ButtonState.BUTTON_UP;
                this.mouseState.buttonRight = ButtonState.BUTTON_UP;
            },

            update: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);

                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];
                        if (entity.hasComponent('InputMouse')) {
                            this.updateInputMouse(entity);
                        }
                    }
                }
            },

            updateInputMouse: function(entity) {
                var inputMouse = entity.getComponent('InputMouse');

                // swap states
                var tmp              = inputMouse.prevState;
                inputMouse.prevState = inputMouse.currState;
                inputMouse.currState = tmp;

                // set current state
                inputMouse.currState.mousePosition.x = this.mouseState.mousePosition.x;
                inputMouse.currState.mousePosition.y = this.mouseState.mousePosition.y;
                inputMouse.currState.mouseWheel.x    = this.mouseState.mouseWheel.x;
                inputMouse.currState.mouseWheel.y    = this.mouseState.mouseWheel.y;
                inputMouse.currState.buttonLeft      = this.mouseState.buttonLeft;
                inputMouse.currState.buttonMiddle    = this.mouseState.buttonMiddle;
                inputMouse.currState.buttonRight     = this.mouseState.buttonRight;
            }
        });

        return InputController;
    }
);
