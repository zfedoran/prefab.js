define([
        'lodash',
        'core/entity',
        'components/transform',
        'components/camera'
    ],
    function(
        _,
        Entity,
        Transform,
        Camera
    ) {
        'use strict';
    
        var CameraEntity = function(viewRect, near, far, fov) {
            Entity.call(this);

            this.addComponent(new Transform());
            this.addComponent(new Camera(viewRect, near, far, fov));
        };

        CameraEntity.prototype = _.create(Entity.prototype, {
            constructor: CameraEntity
        });

        return CameraEntity;
    }
);
