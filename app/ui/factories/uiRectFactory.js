define([
        'lodash',
        'core/factory',
        'graphics/material',
        'components/meshFilter',
        'components/meshRenderer',
        'graphics/mesh',
        'ui/factories/uiElementFactory',
        'ui/components/uiRect',
    ],
    function(
        _,
        Factory,
        Material,
        MeshFilter,
        MeshRenderer,
        Mesh,
        UIElementFactory,
        UIRect
    ) {
        'use strict';
    
        var UIRectFactory = function(context) {
            Factory.call(this, context);

            this.uiElementFactory = new UIElementFactory(context);
        };

        UIRectFactory.prototype = _.create(Factory.prototype, {
            construct: UIRectFactory,

            create: function(name, uiElementStyle, width, height) {
                var entity = this.uiElementFactory.create(name);

                var material = new Material(Material.LAMBERT);

                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));
                entity.addComponent(new UIRect(uiElementStyle));

                return entity;
            }
        });

        return UIRectFactory;
    }
);
