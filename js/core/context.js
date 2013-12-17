define([
        'core/entityManager',
        'core/scene'
    ],
    function(
        EntityManager,
        Scene
    ) {
        'use strict';

        var Context = function(device) {
            this.device = device;
            this.entityManager = new EntityManager();
            this.scene = new Scene(this.entityManager, this.device);
        };

        Context.prototype = {
            constructor: Context
        };

        return Context;
    }
);
