define([
        'lodash',
        'math/rectangle',
        'core/entity',
        'components/transform',
        'components/camera'
    ],
    function(
        _,
        Rectangle,
        Entity,
        Transform,
        Camera
    ) {
        'use strict';

        var GUILayerEntity = function(viewRect, near, far) {
            Entity.call(this);

            if (typeof near === 'undefined') { near = 0; }
            if (typeof far === 'undefined') { far = 100; }

            var camera = new Camera(viewRect, near, far);
            camera.offCenter = true;

            this.addComponent(new Transform());
            this.addComponent(camera);
        };

        GUILayerEntity.prototype = _.create(Entity.prototype, {
            constructor: GUILayerEntity
        });

        return GUILayerEntity;
    }
);
