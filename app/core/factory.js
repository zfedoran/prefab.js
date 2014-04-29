define([
        'core/entity'
    ],
    function(
        Entity
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
            *   This method returns a new entity instance.
            *
            *   @method getNewEntity
            *   @returns {undefined}
            */
            getNewEntity: function() {
                return (new Entity(this.context.entityManager));
            }

        };

        return Factory;
    }
);
