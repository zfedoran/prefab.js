define([
        'core/entityManager',
        'core/entity'
    ],
    function(
        EntityManager,
        Entity
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
                return (new Entity(this._application.entityManager, name));
            }
        };

        return Context;
    }
);
