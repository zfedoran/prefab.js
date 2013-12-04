define([
        'core/entity',
        'components/transform',
        'components/projection',
        'components/view'
    ],
    function(
        Entity,
        Transform,
        Projection,
        View
    ) {
        'use strict';
    
        var Camera = function(width, height, near, far, fov) {
            Entity.call(this);

            this.addComponent(new Transform());
            this.addComponent(new Projection(width, height, near, far, fov));
            this.addComponent(new View());
        };

        Camera.prototype = Object.create(Entity.prototype);

        Camera.prototype.constructor = Camera;

        return Camera;
    }
);
