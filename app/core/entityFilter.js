define([
    ],
    function(
    ) {
        'use strict';

        var EntityFilter = function(name, filterFunction, globalEntities) {
            this.name           = name;
            this.entities       = {};
            this.filterFunction = filterFunction;
            this.globalEntities = globalEntities;

            this.update();
        };

        EntityFilter.prototype = {
            constructor: EntityFilter,

            update: function() {
                this.entities = {};
                var o, entity;
                for (o in this.globalEntities) {
                    if (this.globalEntities.hasOwnProperty(o)) {
                        entity = this.globalEntities[o];
                        if (this.filterFunction(entity)) {
                            this.entities[entity.id] = entity;
                        }
                    }
                }
            },

            remove: function(entity) {
                if (this.entities[entity.id]) {
                    return delete this.entities[entity.id];
                }
                return false;
            },

            matches: function(entity) {
                return this.filterFunction(entity);
            },

            getEntities: function() {
                return this.entities; 
            }
        };

        return EntityFilter;
    }
);
