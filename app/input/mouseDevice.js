define([
        'jquery',
        'lodash',
        'input/inputDevice'
    ],
    function(
        $,
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
                var $win = $(window);

                $win.on('mousemove', $.proxy(this.onMouseMove, this));
                $win.on('mouseup', $.proxy(this.onMouseUp, this));
                $win.on('mousedown', $.proxy(this.onMouseDown, this));
                $win.on('scroll', $.proxy(this.onMouseScroll, this));
            },

            /**
            *   This method removes the window event device bindings.
            *
            *   @method removeEvents
            *   @returns {undefined}
            */
            removeEvents: function() {
                var $win = $(window);

                $win.off('mousemove', this.onMouseMove);
                $win.off('mouseup', this.onMouseUp);
                $win.off('mousedown', this.onMouseDown);
                $win.off('scroll', this.onMouseScroll);
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
            *   This method restores the state of this mouse device.
            *
            *   @method resetState
            *   @returns {undefined}
            */
            resetState: function() {
                this.currentButton = null;
                this.deltaScroll   = 0;

                for (var val in this.pressedButtons) {
                    if (this.pressedButtons.hasOwnProperty(val)) {
                        this.pressedButtons[val] = false;
                    }
                }
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
