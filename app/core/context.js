define([
        'core/entityManager'
    ],
    function(
        EntityManager
    ) {
        'use strict';

        var Context = function(device) {
            this.entityManager = new EntityManager();
            this.device = device;
        };

        Context.prototype = {
            constructor: Context,

            filterByComponents: function(components) {
                return this.entityManager.filterByComponents(components);
            },

            filterByGroupName: function(name) {
                return this.entityManager.filterByGroupName(name);
            },

            addEntity: function(entity) {
                return this.entityManager.addEntity(entity);
            }
        };

        return Context;
    }
);
