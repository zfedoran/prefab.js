define([
        'lodash',
        'core/factory',
        'core/entity',
        'components/transform',
        'components/camera'
    ],
    function(
        _,
        Factory,
        Entity,
        Transform,
        Camera
    ) {
        'use strict';
    
        var CameraFactory = function(context) {
            Factory.call(this, context);
        };

        CameraFactory.prototype = _.create(Factory.prototype, {
            constructor: CameraFactory,

            create: function(viewRect, near, far, fov) {
                var entity = new Entity();

                entity.addComponent(new Transform());
                entity.addComponent(new Camera(viewRect, near, far, fov));

                this.addEntity(entity);

                return entity;
            }
        });

        return CameraFactory;
    }
);
