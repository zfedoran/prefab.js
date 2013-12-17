define([
    ],
    function(
    ) {
        'use strict';

        var SubSystem = function(context, components) {
            this.context        = context;
            this.device         = context.device;
            this.entityManager  = context.entityManager;
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
