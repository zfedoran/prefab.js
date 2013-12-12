define([
        'math/rectangle',
        'core/entity',
        'components/transform',
        'components/projection',
        'components/view',
        'components/guiLayer'
    ],
    function(
        Rectangle,
        Entity,
        Transform,
        Projection,
        View,
        GUILayer
    ) {
        'use strict';

        var GUILayerEntity = function(width, height, offsetX, offsetY) {
            Entity.call(this);

            if (typeof offsetX === 'undefined') { offsetX = 0; }
            if (typeof offsetY === 'undefined') { offsetY = 0; }

            var viewRect = new Rectangle(offsetX, offsetY, width, height);
            this.addComponent(new Transform());
            this.addComponent(new Projection(width, height, 0, 100));
            this.addComponent(new View());
            this.addComponent(new GUILayer(viewRect));
        };

        GUILayerEntity.prototype = Object.create(Entity.prototype);

        GUILayerEntity.prototype.construct = GUILayerEntity;

        return GUILayerEntity;
    }
);
