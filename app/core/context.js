define([
        'lodash',
        'core/entityManager',
        'core/events'
    ],
    function(
        _,
        EntityManager,
        Events
    ) {
        'use strict';

        /**
        *   The Context class maintains the current application state.
        *
        *   @method 
        *   @param {device}
        *   @returns {undefined}
        */
        var Context = function(app) {
            this._application = app;

            // Useful debug access
            window.context = this;
        };

        Context.prototype = {
            constructor: Context,

            /**
            *   This method returns the total time that has elapsed since the
            *   application started running.
            *
            *   @method getTotalTimeInSeconds
            *   @returns {float}
            */
            getTotalTimeInSeconds: function() {
                return this._application.time;
            },

            /**
            *   This method returns the average frames per second that the
            *   application is running at.
            *
            *   @method getFramesPerSecond
            *   @returns {undefined}
            */
            getFramesPerSecond: function() {
                return this._application.fps;
            },

            /**
            *   This method returns the current keyboard device.
            *
            *   @method getKeyboardDevice
            *   @returns {undefined}
            */
            getKeyboardDevice: function() {
                return this._application.keyboardDevice;
            },

            /**
            *   This method returns the current mouse device.
            *
            *   @method getMouseDevice
            *   @returns {undefined}
            */
            getMouseDevice: function() {
                return this._application.mouseDevice;
            },

            /**
            *   This method returns the current graphics device.
            *
            *   @method getGraphicsDevice
            *   @returns {GraphicsDevice}
            */
            getGraphicsDevice: function() {
                return this._application.device;
            },

            /**
            *   This method returns the application event queue.
            *
            *   @method getEventQueue
            *   @returns {undefined}
            */
            getEventQueue: function() {
                return this._application.eventQueue;
            },

            /**
            *   This method returns the application asset library.
            *
            *   @method getAssetLibrary
            *   @returns {object}
            */
            getAssetLibrary: function() {
                return this._application.assetLibrary;
            },

            /**
            *   This method returns a hashmap of all entities that contain the
            *   provided component list.
            *
            *   @method filterByComponents
            *   @param {components}
            *   @returns {object}
            */
            filterByComponents: function(components) {
                return this._application.entityManager.filterByComponents(components);
            },

            /**
            *   This method returns a hashmap of all entities that belong to
            *   the provided group name.
            *
            *   @method filterByGroupName
            *   @param {name}
            *   @returns {object}
            */
            filterByGroupName: function(name) {
                return this._application.entityManager.filterByGroupName(name);
            },

            /**
            *   This method returns a new entity instance.
            *
            *   @method createNewEntity
            *   @param {name}
            *   @returns {entity}
            */
            createNewEntity: function(name) {
                return this._application.entityManager.createNewEntity(name);
            }
        };

        _.extend(Context.prototype, Events.prototype);

        return Context;
    }
);
