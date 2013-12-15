define([
    ],
    function(
    ) {
        'use strict';

        var SubSystem = function(entityManager, components) {
            this.entityManager  = entityManager;
            this.filter         = components;
            this.filterHash     = this.entityManager.getFilterNameForComponents(components);
            this.filterFunction = this.entityManager.getFilterFunctionForComponents(components);
            this.entityManager.addFilter(this.filterHash, this.filterFunction);
        };

        SubSystem.prototype = {
        };

        return SubSystem;
    }
);
