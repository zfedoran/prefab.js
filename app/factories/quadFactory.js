define([
        'lodash',
        'core/factory',
        'factories/baseFactory',
        'graphics/material',
        'components/quad',
        'components/meshFilter',
        'components/meshRenderer',
        'graphics/mesh'
    ],
    function(
        _,
        Factory,
        BaseFactory,
        Material,
        Quad,
        MeshFilter,
        MeshRenderer,
        Mesh
    ) {
        'use strict';
    
        var QuadFactory = function(context) {
            Factory.call(this, context);

            this.baseFactory = new BaseFactory(context);
        };

        QuadFactory.prototype = _.create(Factory.prototype, {
            construct: QuadFactory,

            create: function(name, sprite, width, height) {
                var entity = this.baseFactory.create(name);

                entity.setDimensions(width, height);

                var material;
                if (sprite) {
                    material            = new Material(Material.LAMBERT);
                    material.diffuseMap = sprite.getTexture();
                } else {
                    material            = new Material(Material.BASIC);
                }

                entity.addComponent(new Quad(sprite));
                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));

                return entity;
            }
        });

        return QuadFactory;
    }
);
