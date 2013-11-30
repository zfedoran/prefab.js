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

        var GUILayerEntity = function(x, y, width, height) {
            Entity.call(this);

            var rect = new Rectangle(x, y, width, height);
            this.addComponent(new Transform());
            this.addComponent(new Projection(width, height, 0, 100));
            this.addComponent(new View());
            this.addComponent(new GUILayer(rect));
        };

        GUILayerEntity.prototype = Object.create(Entity.prototype);

        GUILayerEntity.prototype.construct = GUILayerEntity;

        return GUILayerEntity;
    }
);
