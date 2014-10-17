define([
        'lodash',
        'core/factory',
        'graphics/material',
        'components/meshFilter',
        'components/meshRenderer',
        'ui/factories/uiElementFactory',
        'ui/components/uiLabel'
    ],
    function(
        _,
        Factory,
        Material,
        MeshFilter,
        MeshRenderer,
        UIElementFactory,
        UILabel
    ) {
        'use strict';
    
        var UILabelFactory = function(context) {
            Factory.call(this, context);

            this.uiElementFactory = new UIElementFactory(context);
        };

        UILabelFactory.prototype = _.create(Factory.prototype, {
            construct: UILabelFactory,

            create: function(name, text, uiElementStyle) {
                var entity = this.uiElementFactory.create(name);

                var material = new Material(Material.TEXT);

                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));
                entity.addComponent(new UILabel(text, uiElementStyle));

                return entity;
            }
        });

        return UILabelFactory;
    }
);
