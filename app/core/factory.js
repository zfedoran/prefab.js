define([
    ],
    function(
    ) {
        'use strict';

        /**
        *   Abstract factory class.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var Factory = function(context) {
            this.context = context;
            this.device  = context.device;
        };

        Factory.prototype = {
            constructor: Factory,

            /**
            *   All controllers must implement an create method.
            *
            *   @method create
            *   @returns {undefined}
            */
            create: function() {
                throw 'Factory: create() function not implemented.';
            },

            /**
            *   Add an entity to the context.
            *
            *   @method addEntity
            *   @param {entity}
            *   @returns {undefined}
            */
            addEntity: function(entity) {
                this.context.addEntity(entity);
            }

        };

        return Factory;
    }
);
