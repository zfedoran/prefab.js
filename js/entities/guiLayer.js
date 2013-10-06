define([
        'core/entity',
        'components/transform',
        'components/projection',
        'components/view',
        'components/guiLayer'
    ],
    function(
        Entity,
        Transform,
        Projection,
        View,
        GUILayer
    ) {

        var GUILayerEntity = function(width, height) {
            Entity.call(this);

            this.addComponent(new Transform());
            this.addComponent(new Projection(width, height, 0, 100));
            this.addComponent(new View());
            this.addComponent(new GUILayer());
        };

        GUILayerEntity.prototype = Object.create(Entity.prototype);

        GUILayerEntity.prototype.construct = GUILayerEntity;

        return GUILayerEntity;
    }
);
