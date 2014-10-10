define([
        'lodash',
        'core/factory',
        'graphics/material',
        'components/meshFilter',
        'components/meshRenderer',
        'ui/factories/uiElementFactory',
        'ui/components/uiText'
    ],
    function(
        _,
        Factory,
        Material,
        MeshFilter,
        MeshRenderer,
        UIElementFactory,
        UIText
    ) {
        'use strict';
    
        var UITextFactory = function(context) {
            Factory.call(this, context);

            this.uiElementFactory = new UIElementFactory(context);
        };

        UITextFactory.prototype = _.create(Factory.prototype, {
            construct: UITextFactory,

            create: function(name, text, uiElementStyle) {
                var entity = this.uiElementFactory.create(name);

                var material = new Material(Material.TEXT);

                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));
                entity.addComponent(new UIText(text, uiElementStyle));

                return entity;
            }
        });

        return UITextFactory;
    }
);
