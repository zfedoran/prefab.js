define([
        'lodash',
        'core/factory',
        'graphics/material',
        'components/transform',
        'components/label',
        'components/meshFilter',
        'components/meshRenderer',
        'graphics/mesh'
    ],
    function(
        _,
        Factory,
        Material,
        Transform,
        Label,
        MeshFilter,
        MeshRenderer,
        Mesh
    ) {
        'use strict';
    
        var LabelFactory = function(context) {
            Factory.call(this, context);
        };

        LabelFactory.prototype = _.create(Factory.prototype, {
            construct: LabelFactory,

            create: function(text, fontFamily, fontSize, width, height, lineHeight) {
                var entity = this.context.createNewEntity();

                var material = new Material(Material.TEXT);

                entity.addComponent(new Transform());
                entity.addComponent(new Label(text, fontFamily, fontSize, width, height, lineHeight));
                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));

                return entity;
            }
        });

        return LabelFactory;
    }
);
