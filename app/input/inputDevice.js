define([
        'jquery',
        'lodash',
        'core/events'
    ],
    function(
        $,
        _,
        Events
    ) {
        'use strict';

        /**
        *   Abstract input device class
        *
        *   @class 
        *   @constructor
        */
        var InputDevice = function() {
            this.init();
        };

        InputDevice.prototype = {
            constructor: InputDevice,

            /**
            *   This method initializes this input device and binds it to the
            *   window events.
            *
            *   @method init
            *   @returns {undefined}
            */
            init: function() {
                var $win = $(window);

                $win.on('blur', $.proxy(this.resetState, this));

                this.initEvents();
            },

            /**
            *   This method is a deconstructor for the input device.
            *
            *   @method destroy
            *   @returns {undefined}
            */
            destroy: function() {
                var $win = $(window);

                $win.off('blur', $.proxy(this.resetState, this));

                this.removeEvents();
            },

            /**
            *   Abstract method that all input devices should implement.
            *   Typically the input device will bind to the webkit events here.
            *
            *   @method initEvents
            *   @returns {undefined}
            */
            initEvents: function() {
                throw 'InputDevice: initEvents() not implemented.';
            },

            /**
            *   Abstract method that all input devices should implement.
            *   Typically the input device will unbind webkit events here.
            *
            *   @method removeEvents
            *   @returns {undefined}
            */
            removeEvents: function() {
                throw 'InputDevice: removeEvents() not implemented.';
            },

            /**
            *   Abstract method for reseting this input device. This may happen
            *   if the window blurs. Webkit does not provide input state for
            *   devices when the window is not in focus.
            *
            *   @method resetState
            *   @returns {undefined}
            */
            resetState: function() {
                throw 'InputDevice: resetState() not implemented.';
            },
        };

        // Add event support
        _.extend(InputDevice.prototype, Events.prototype);

        return InputDevice;
    }
);
