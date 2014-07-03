define([
        'core/entityFilter',
        'core/entityGroup'
    ],
    function(
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
        */
        var EntityManager = function() {
            this.entities = {};
            this.filters = {};
            this.groups = {};

            // Private Methods
            // ----------------------------------------------------------------

            /**
            *   This method updates the internal filters used to filter the
            *   provided entity by components.
            *
            *   @method updateFiltersForEntity
            *   @param {entity}
            *   @returns {undefined}
            */
            var _updateFiltersForEntity = (function(entity) {
                var o, filter;
                for (o in this.filters) {
                    if (this.filters.hasOwnProperty(o)) {
                        filter = this.filters[o];
                        if (filter.matches(entity)) {
                            filter.update();
                        }
                    }
                }
            }).bind(this);

            /**
            *   Remove an entity from all internal filters.
            *
            *   @method removeEntityFromAllFilters
            *   @param {entity}
            *   @returns {undefined}
            */
            var _removeEntityFromAllFilters = (function(entity) {
                var o, filter;
                for (o in this.filters) {
                    if (this.filters.hasOwnProperty(o)) {
                        filter = this.filters[o];
                        filter.remove(entity);
                    }
                }
            }).bind(this);

            /**
            *   Remove an entity from all groups.
            *
            *   @method removeEntityFromAllGroups
            *   @param {entity}
            *   @returns {undefined}
            */
            var _removeEntityFromAllGroups = (function(entity) {
                var o, group;
                for (o in this.groups) {
                    if (this.groups.hasOwnProperty(o)) {
                        group = this.groups[o];
                        group.remove(entity);
                    }
                }
            }).bind(this);

            // Public Methods
            // ----------------------------------------------------------------

            /**
            *   Add an entity to this manager and update the filters based on
            *   the components assigned to the entity.
            *
            *   @method addEntity
            *   @param {entity}
            *   @returns {undefined}
            */
            this.addEntity = function(entity) {
                this.entities[entity.id] = entity;
                _updateFiltersForEntity(entity);
                entity.on('added:component', function() { _updateFiltersForEntity(entity); }, this);
            };

            /**
            *   Remove an entity from this manager and update all filters which
            *   may refer to it.
            *
            *   @method removeEntity
            *   @param {entity}
            *   @returns {undefined}
            */
            this.removeEntity = function(entity) {
                var success = delete this.entities[entity.id];
                if (success) {
                    _removeEntityFromAllFilters(entity);
                    _removeEntityFromAllGroups(entity);
                }
                return success;
            };
        };

        EntityManager.prototype = {
            constructor: EntityManager,

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
            }
        };

        return EntityManager;
    }
);
