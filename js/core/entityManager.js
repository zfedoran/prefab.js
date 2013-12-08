define([
        'core/entityFilter'
    ],
    function(
        EntityFilter
    ) {
        'use strict';

        var EntityManager = function() {
            this.entities = {};
            this.filters = {};
        };

        EntityManager.prototype = {
            constructor: EntityManager,

            addEntity: function(entity) {
                this.entities[entity.id] = entity;
                this.updateFiltersForEntity(entity);
                //entity.setEntityManager(this);
            },

            getEntity: function(id) {
                return this.entities[id];
            },

            removeEntity: function(entity) {
                var success = delete this.entities[entity.id];
                if (success) {
                    this.removeEntityFromAllFilters(entity);
                }
                return success;
            },

            getAllUsingFilter: function(name) {
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
            }
        };

        return EntityManager;
    }
);
