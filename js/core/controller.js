define([
    ],
    function(
    ) {
        'use strict';

        var Controller = function(context, components) {
            this.context        = context;
            this.device         = context.device;
            this.entityManager  = context.entityManager;
            this.filter         = components;
            this.filterHash     = this.entityManager.getFilterNameForComponents(components);
            this.filterFunction = this.entityManager.getFilterFunctionForComponents(components);
            this.entityManager.addFilter(this.filterHash, this.filterFunction);
        };

        Controller.prototype = {
        };

        return Controller;
    }
);
