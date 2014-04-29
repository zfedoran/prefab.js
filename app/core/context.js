define([
        'core/entityManager',
        'core/entity'
    ],
    function(
        EntityManager,
        Entity
    ) {
        'use strict';

        var Context = function(device) {
            this.entityManager = new EntityManager();
            this.device = device;
        };

        Context.prototype = {
            constructor: Context,

            /**
            *   This method returns a hashmap of all entities that contain the
            *   provided component list.
            *
            *   @method filterByComponents
            *   @param {components}
            *   @returns {object}
            */
            filterByComponents: function(components) {
                return this.entityManager.filterByComponents(components);
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
                return this.entityManager.filterByGroupName(name);
            },

            /**
            *   This method returns a new entity instance.
            *
            *   @method createNewEntity
            *   @param {name}
            *   @returns {entity}
            */
            createNewEntity: function(name) {
                return (new Entity(this.entityManager, name));
            }
        };

        return Context;
    }
);
