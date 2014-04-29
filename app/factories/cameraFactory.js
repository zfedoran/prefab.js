define([
        'lodash',
        'core/factory',
        'components/transform',
        'components/camera'
    ],
    function(
        _,
        Factory,
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
                var entity = this.context.createNewEntity();

                entity.addComponent(new Transform());
                entity.addComponent(new Camera(viewRect, near, far, fov));

                return entity;
            }
        });

        return CameraFactory;
    }
);
