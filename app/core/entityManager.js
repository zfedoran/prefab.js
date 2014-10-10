define([
        'core/entity',
        'core/entityFilter',
        'core/entityGroup'
    ],
    function(
        Entity,
        EntityFilter,
        EntityGroup
    ) {
        'use strict';

        /**
        *   This class maintains entities, filters, and groups. Entites can be
        *   filtered by which components they have or by group names.
        *
        *   @class 
        *   @constructor
        *   @param {context}
        */
        var EntityManager = function(context) {
            this.entities = {};
            this.filters  = {};
            this.groups   = {};
            this.context  = context;
        };

        EntityManager.prototype = {
            constructor: EntityManager,

            /**
            *   This method returns a new instance of Entity.
            *
            *   @method createNewEntity
            *   @param {name}
            *   @returns {undefined}
            */
            createNewEntity: function(name) {
                return new Entity(name, this, this.context);
            },

            /**
            *   Add an entity to this manager and update the filters based on
            *   the components assigned to the entity.
            *
            *   @method addEntity
            *   @param {entity}
            *   @returns {undefined}
            */
            addEntity: function(entity) {
                this.entities[entity.id] = entity;
                this.updateFiltersForEntity(entity);
            },

            /**
            *   Remove an entity from this manager and update all filters which
            *   may refer to it.
            *
            *   @method removeEntity
            *   @param {entity}
            *   @returns {undefined}
            */
            removeEntity: function(entity) {
                var success = delete this.entities[entity.id];
                if (success) {
                    this.removeEntityFromAllFilters(entity);
                    this.removeEntityFromAllGroups(entity);
                }
                return success;
            },

            /**
            *   Add the provided entity to the group name.
            *
            *   @method addEntityToGroup
            *   @param {entity}
            *   @param {name}
            *   @returns {undefined}
            */
            addEntityToGroup: function(entity, name) {
                var group = this.groups[name];
                if (typeof group === 'undefined') {
                    group = new EntityGroup(name);
                    this.groups[name] = group;
                }
                group.addEntity(entity);
            },

            /**
            *   Remove the provided entity from the group.
            *
            *   @method removeEntityFromGroup
            *   @param {entity}
            *   @param {name}
            *   @returns {undefined}
            */
            removeEntityFromGroup: function(entity, name) {
                var group = this.groups[name];
                if (typeof group !== 'undefined') {
                    group.removeEntity(entity);
                }
            },

            /**
            *   Remove all entities from the group.
            *
            *   @method removeAllEntitiesFromGroup
            *   @param {name}
            *   @returns {undefined}
            */
            removeAllEntitiesFromGroup: function(name) {
                var group = this.groups[name];
                if (typeof group !== 'undefined') {
                    group.reset();
                }
            },

            /**
            *   This method returns all entities which have all of the
            *   components provided.
            *
            *   @method filterByComponents
            *   @param {components}
            *   @returns {object} A hashmap of all matching entities
            */
            filterByComponents: function(components) {
                var filterHash = components.sort().join('.');

                if (!this.filters[filterHash]) {
                    this.filters[filterHash] = new EntityFilter(filterHash, function(entity) {
                        var i, len = components.length, result = true;
                        for (i = 0; i < len; i++) {
                            result = result && entity.hasComponent(components[i]);
                        }
                        return result;
                    }, this.entities);
                }

                return this.filters[filterHash].getEntities();
            },

            /**
            *   This method returns all entities which belong to the provided
            *   group name.
            *
            *   @method filterByGroupName
            *   @param {name}
            *   @returns {object} A hashmap of all matching entities
            */
            filterByGroupName: function(name) {
                var group = this.groups[name];

                if (typeof group === 'undefined') {
                    group = new EntityGroup(name);
                    this.groups[name] = group;
                }

                return group.getEntities();
            },

            /**
            *   This method updates the internal filters used to filter the
            *   provided entity by components.
            *
            *   @method updateFiltersForEntity
            *   @param {entity}
            *   @returns {undefined}
            */
            updateFiltersForEntity: function(entity) {
                var o, filter;
                for (o in this.filters) {
                    if (this.filters.hasOwnProperty(o)) {
                        filter = this.filters[o];
                        // TODO: fix this (on component removal)
                        if (filter.matches(entity)) {
                            filter.update();
                        }
                    }
                }
            },

            /**
            *   Remove an entity from all groups.
            *
            *   @method removeEntityFromAllGroups
            *   @param {entity}
            *   @returns {undefined}
            */
            removeEntityFromAllGroups: function(entity) {
                var o, group;
                for (o in this.groups) {
                    if (this.groups.hasOwnProperty(o)) {
                        group = this.groups[o];
                        group.remove(entity);
                    }
                }
            },

            /**
            *   Remove an entity from all internal filters.
            *
            *   @method removeEntityFromAllFilters
            *   @param {entity}
            *   @returns {undefined}
            */
            removeEntityFromAllFilters: function(entity) {
                var o, filter;
                for (o in this.filters) {
                    if (this.filters.hasOwnProperty(o)) {
                        filter = this.filters[o];
                        filter.remove(entity);
                    }
                }
            }
        };

        return EntityManager;
    }
);
