define([
        'lodash',
        'input/inputDevice'
    ],
    function(
        _,
        InputDevice
    ) {
        'use strict';

        var MouseDevice = function() {
            InputDevice.call(this);

            // The current button being released or pressed
            this.currentButton = null;

            // The current (x, y) position of the mouse (relative to bottom left corner)
            this.relativeX = 0;
            this.relativeY = 0;

            // The current mouse delta values
            this.deltaX      = 0;
            this.deltaY      = 0;
            this.deltaScroll = 0;

            // A map of all buttons that may be down
            this.pressedButtons = {};

            // Boolean for event bubbling support
            this._eventPropagation = true;
        };

        MouseDevice.prototype = _.create(InputDevice.prototype, {
            constructor: MouseDevice,

            /**
            *   This method binds this device to window events.
            *
            *   @method init
            *   @returns {undefined}
            */
            initEvents: function() {
                this._onMouseMove   = this.onMouseMove.bind(this);
                this._onMouseUp     = this.onMouseUp.bind(this);
                this._onMouseDown   = this.onMouseDown.bind(this);
                this._onMouseScroll = this.onMouseScroll.bind(this);

                window.addEventListener('mousemove', this._onMouseMove, false);
                window.addEventListener('mouseup', this._onMouseUp, false);
                window.addEventListener('mousedown', this._onMouseDown, false);
                window.addEventListener('scroll', this._onMouseScroll, false);
            },

            /**
            *   This method removes the window event device bindings.
            *
            *   @method removeEvents
            *   @returns {undefined}
            */
            removeEvents: function() {
                window.removeEventListener('mousemove', this._onMouseMove, false);
                window.removeEventListener('mouseup', this._onMouseUp, false);
                window.removeEventListener('mousedown', this._onMouseDown, false);
                window.removeEventListener('scroll', this._onMouseScroll, false);
            },

            /**
            *   This method converts webkit buttonCodes to application keycodes.
            *
            *   @method convertKeyCode
            *   @param {webkitButtonCode}
            *   @returns {undefined}
            */
            convertButtonCode: function(webkitButtonCode) {
                return webkitButtonMapping[webkitButtonCode];
            },

            /**
            *   This method handles the window mouse move event.
            *
            *   @method onMouseMove
            *   @param {event}
            *   @returns {undefined}
            */
            onMouseMove: function(event) {
                event.stopPropagation();
                event.preventDefault();

                this.deltaScroll   = 0;
                this.deltaX        = this.relativeX - event.pageX;
                this.deltaY        = this.relativeY - event.pageY;
        
                this.relativeX     = event.pageX;
                this.relativeY     = event.pageY;
                this.currentButton = null;

                this._eventPropagation = true;

                this.trigger('mousemove', this);
            },

            /**
            *   This method handles the window mouse down event.
            *
            *   @method onMouseDown
            *   @param {event}
            *   @returns {undefined}
            */
            onMouseDown: function(event) {
                event.stopPropagation();
                event.preventDefault();

                this.deltaScroll   = 0;
                this.deltaX        = this.relativeX - event.pageX;
                this.deltaY        = this.relativeY - event.pageY;
        
                this.relativeX   = event.pageX;
                this.relativeY   = event.pageY;

                // Convert the buttonCode
                var buttonCode = this.convertButtonCode(event.button);

                this._eventPropagation = true;

                // If the buttonCode exists
                if (typeof buttonCode !== 'undefined') {

                    // If this button is not already down
                    if (!this.pressedButtons[buttonCode]) {
                        this.pressedButtons[buttonCode] = true;
                        this.currentButton = buttonCode;

                        this.trigger('mousedown', this);
                    }
                }
            },

            /**
            *   This method handles the window mouse up event.
            *
            *   @method onMouseUp
            *   @param {event}
            *   @returns {undefined}
            */
            onMouseUp: function(event) {
                event.stopPropagation();
                event.preventDefault();
            
                this.deltaScroll   = 0;
                this.deltaX        = this.relativeX - event.pageX;
                this.deltaY        = this.relativeY - event.pageY;
        
                this.relativeX   = event.pageX;
                this.relativeY   = event.pageY;

                // Convert the buttonCode
                var buttonCode = this.convertButtonCode(event.button);

                this._eventPropagation = true;

                // If the buttonCode exists
                if (typeof buttonCode !== 'undefined') {
                    this.pressedButtons[buttonCode] = false;
                    this.currentButton = buttonCode;

                    this.trigger('mouseup', this);
                }
            },

            /**
            *   This method handles the window mouse scroll events.
            *
            *   @method onMouseScroll
            *   @param {event}
            *   @returns {undefined}
            */
            onMouseScroll: function(event) {
                event.stopPropagation();
                event.preventDefault();
            
                this.deltaScroll   = event.wheelDelta;
                this.deltaX        = this.relativeX - event.pageX;
                this.deltaY        = this.relativeY - event.pageY;
        
                this.relativeX     = event.pageX;
                this.relativeY     = event.pageY;
                this.currentButton = null;

                this._eventPropagation = true;

                this.trigger('mousescroll', this);
            },

            /**
            *   This method returns the current button being pressed.
            *
            *   @method getCurrentButton
            *   @returns {undefined}
            */
            getCurrentButton: function() {
                return this.currentButton;
            },

            /**
            *   This method tells external controllers to stop propagating
            *   events from this device.
            *
            *   @method stopEventPropagation
            *   @returns {undefined}
            */
            stopEventPropagation: function() {
                this._eventPropagation = false;
            },

            /**
            *   This method returns whether event propagation is enabled on
            *   this device.
            *
            *   @method isEventPropagationEnabled
            *   @returns {undefined}
            */
            isEventPropagationEnabled: function() {
                return this._eventPropagation;
            },

            /**
            *   This method enables event propagation on external controllers
            *   for this device.
            *
            *   @method enableEventPropagation
            *   @returns {undefined}
            */
            enableEventPropagation: function() {
                this._eventPropagation = true;
            }
        });

        // Webkit to application buttonCode mapping
        var webkitButtonMapping = {
            0: 0,
            1: 1,
            2: 2
        };

        // Default input device button mapping
        MouseDevice.buttonCodes = {
            BUTTON_0    : 0,
            BUTTON_1    : 1,
            BUTTON_2    : 2
        };

        return MouseDevice;
    }
);
