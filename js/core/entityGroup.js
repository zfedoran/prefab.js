define([
    ],
    function(
    ) {
        'use strict';

        var EntityGroup = function(name) {
            this.name = name;
            this.entities = {};
        };

        EntityGroup.prototype = {
            constructor: EntityGroup,

            reset: function() {
                this.entities = {};
            },

            addEntity: function(entity) {
                this.entities[entity.id] = entity;
            },

            remove: function(entity) {
                if (this.entities[entity.id]) {
                    return delete this.entities[entity.id];
                }
                return false;
            },

            matches: function(entity) {
                return this.entities[entity.id];
            },

            getEntities: function() {
                return this.entities; 
            }
        };

        return EntityGroup;
    }
);
