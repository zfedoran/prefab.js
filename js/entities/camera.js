define([
        'core/entity',
        'components/transform',
        'components/camera'
    ],
    function(
        Entity,
        Transform,
        Camera
    ) {
        'use strict';
    
        var CameraEntity = function(width, height, near, far, fov) {
            Entity.call(this);

            this.addComponent(new Transform());
            this.addComponent(new Camera(width, height, near, far, fov));
        };

        CameraEntity.prototype = Object.create(Entity.prototype);

        CameraEntity.prototype.constructor = CameraEntity;

        return CameraEntity;
    }
);
