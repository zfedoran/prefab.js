define([
    ],
    function(
    ) {
        'use strict';

        /**
        *   Abstract controller class.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var Controller = function(context) {
            this.context = context;
            this.device  = context.getGraphicsDevice();
        };

        Controller.prototype = {
            constructor: Controller,

            /**
            *   All controllers must implement an update method.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                throw 'Controller: update() function not implemented.';
            },

            /**
            *   This method invokes the callback function, passing in the
            *   current entity, once for each entity that matches the provided 
            *   selector.
            *
            *   @method filterBy
            *   @param {selector} A list of components or a group name to filter by.
            *   @param {callback} Optional callback to call for each matching entity.
            *   @returns {object} A hashmap of all matching entities
            */
            filterBy: function(selector, callback, context) {
                var entities;
                if (typeof selector === 'string') {
                    entities = this.context.filterByGroupName(selector);
                } else {
                    entities = this.context.filterByComponents(selector);
                }

                if (typeof callback === 'function') {
                    var o, entity;
                    for (o in entities) {
                        if (entities.hasOwnProperty(o)) {
                            entity = entities[o];
                            callback.call(this, entity);
                        }
                    }
                }

                return entities;
            }

        };

        return Controller;
    }
);
