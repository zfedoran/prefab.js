define([
    ],
    function(
    ) {
        'use strict';

        var SubSystem = function(entityManager, filter) {
            this.filter = filter;
            this.filterHash = _generateFilterHash(filter);
            this.filterFunction = _generateFilterFunction(filter);
            this.entityManager = entityManager;
            this.entityManager.addFilter(this.filterHash, this.filterFunction);
        };

        SubSystem.prototype = {
        };

        function _generateFilterFunction(components) {
            return function(entity) {
                var i, result = true;
                for (i = 0; i < components.length; i++) {
                    result = result && entity.hasComponent(components[i]);
                }
                return result;
            };
        }

        function _generateFilterHash(components) {
            var i, component, str, hash, char, filter = 0;
            for (i = 0; i < components.length; i++) {
                hash = 0;
                component = components[i];

                if (typeof component === 'string') {
                    str = component;
                } else {
                    str = component.__name__;
                }

                if (str.length === 0) {
                    return hash;
                }

                for (i = 0; i < str.length; i++) {
                    char = str.charCodeAt(i);
                    hash = ((hash<<5)-hash)+char;
                    hash = hash & hash; // Convert to 32bit integer
                }

                filter |= hash;
            }
            return filter;
        }

        return SubSystem;
    }
);
