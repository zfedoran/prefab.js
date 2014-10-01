define([
        'lodash',
        'core/factory',
        'graphics/material',
        'components/transform',
        'components/meshFilter',
        'components/meshRenderer',
        'graphics/mesh',
        'ui/components/uiText'
    ],
    function(
        _,
        Factory,
        Material,
        Transform,
        MeshFilter,
        MeshRenderer,
        Mesh,
        UIText
    ) {
        'use strict';
    
        var UITextFactory = function(context) {
            Factory.call(this, context);
        };

        UITextFactory.prototype = _.create(Factory.prototype, {
            construct: UITextFactory,

            create: function(text, fontFamily, fontSize, width, height, lineHeight) {
                var entity = this.context.createNewEntity();

                var material = new Material(Material.TEXT);

                entity.addComponent(new Transform());
                entity.addComponent(new UIText(text, fontFamily, fontSize, width, height, lineHeight));
                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));

                return entity;
            }
        });

        return UITextFactory;
    }
);
