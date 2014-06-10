define([
        'lodash',
        'core/controller',
        'controllers/mouseController'
    ],
    function(
        _,
        Controller,
        MouseController
    ) {
        'use strict';
    
        /**
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var EventController = function(context) {
            Controller.call(this, context);

            this.mouseController = new MouseController(context);
        };

        EventController.prototype = _.create(Controller.prototype, {
            constructor: EventController,

            /**
            *   This method consumes the application event queue and calls the
            *   appropriate event handler.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                // Get the application event queue
                var eventQueue = this.context.getEventQueue();

                // Get a list of unique events
                var uniqueEventList = _.uniq(eventQueue, 'type');

                // Handle the events
                var i, len = uniqueEventList.length, event;
                for (i = 0; i < len; i++) {
                    this.handleEvent(uniqueEventList[i]);
                }

                // Clear the application event queue
                eventQueue.length = 0;
            },

            /**
            *   This method calls the appropriate event handler based on the
            *   event type.
            *
            *   @method handleEvent
            *   @param {event}
            *   @returns {undefined}
            */
            handleEvent: function(event) {
                switch (event.type) {
                    case 'mousemove':
                    case 'mousedown':
                    case 'mouseup':
                    case 'click':
                    case 'scroll':
                        this.handleMouseEvent(event);
                        break;
                    case 'keyup':
                    case 'keydown':
                    case 'keypress':
                        this.handleKeyboardEvent(event);
                        break;
                    case 'resize':
                        this.handleApplicationEvent(event);
                        break;
                }
            },

            handleMouseEvent: function(event) {
                this.mouseController.handleEvent(event);
            },

            handleKeyboardEvent: function(event) {
                this.keyboardController.handleEvent(event);
            },

            handleApplicationEvent: function(event) {
            },

        });

        return EventController;
    }
);
