define([
        'core/entityFilter',
        'core/entityGroup'
    ],
    function(
        EntityFilter,
        EntityGroup
    ) {
        'use strict';

        var EntityManager = function() {
            this.entities = {};
            this.filters = {};
            this.groups = {};
        };

        EntityManager.prototype = {
            constructor: EntityManager,

            addEntity: function(entity) {
                this.entities[entity.id] = entity;
                this.updateFiltersForEntity(entity);
            },

            getEntity: function(id) {
                return this.entities[id];
            },

            removeEntity: function(entity) {
                var success = delete this.entities[entity.id];
                if (success) {
                    this.removeEntityFromAllFilters(entity);
                    this.removeEntityFromAllGroups(entity);
                }
                return success;
            },

            addEntityToGroup: function(entity, name) {
                var group = this.groups[name];
                if (typeof group === 'undefined') {
                    group = new EntityGroup(name);
                    this.groups[name] = group;
                }
                group.addEntity(entity);
            },

            getAllUsingGroupName: function(name) {
                var group = this.groups[name];
                if (typeof group !== 'undefined') {
                    return group.getEntities();
                }
            },

            getAllUsingFilterName: function(name) {
                var filter = this.filters[name];
                if (typeof filter !== 'undefined') {
                    return filter.getEntities();
                }
            },

            addFilter: function(name, filterFunction) {
                if (!this.filters[name]) {
                    var filter = new EntityFilter(name, filterFunction, this.entities);
                    this.filters[name] = filter;
                    filter.update();
                }
            },

            updateAllFilters: function() {
                var o, filter;
                for (o in this.filters) {
                    if (this.filters.hasOwnProperty(o)) {
                        filter = this.filters[o];
                        filter.update();
                    }
                }
            },

            updateFiltersForEntity: function(entity) {
                var o, filter;
                for (o in this.filters) {
                    if (this.filters.hasOwnProperty(o)) {
                        filter = this.filters[o];
                        if (filter.matches(entity)) {
                            filter.update();
                        }
                    }
                }
            },

            removeEntityFromAllFilters: function(entity) {
                var o, filter;
                for (o in this.filters) {
                    if (this.filters.hasOwnProperty(o)) {
                        filter = this.filters[o];
                        filter.remove(entity);
                    }
                }
            },

            removeEntityFromAllGroups: function(entity) {
                var o, group;
                for (o in this.groups) {
                    if (this.groups.hasOwnProperty(o)) {
                        group = this.groups[o];
                        group.remove(entity);
                    }
                }
            },

            getAllMatchingFiltersFor: function(entity) {
                var o, filter, result = [];
                for (o in this.filters) {
                    if (this.filters.hasOwnProperty(o)) {
                        filter = this.filters[o];
                        if (filter.matches(entity)) {
                            result.push(filter);
                        }
                    }
                }
                return result;
            },

            getAllMatchingGroupsFor: function(entity) {
                var o, group, result = [];
                for (o in this.groups) {
                    if (this.groups.hasOwnProperty(o)) {
                        group = this.groups[o];
                        if (group.matches(entity)) {
                            result.push(group);
                        }
                    }
                }
                return result;
            },

            getFilterNameForComponents: function(components) {
                return components.sort().join('.');
            },

            getFilterFunctionForComponents: function(components) {
                return function(entity) {
                    var i, result = true;
                    for (i = 0; i < components.length; i++) {
                        result = result && entity.hasComponent(components[i]);
                    }
                    return result;
                };
            }
        };

        return EntityManager;
    }
);
