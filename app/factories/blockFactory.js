define([
        'lodash',
        'core/factory',
        'factories/baseFactory',
        'graphics/material',
        'components/block',
        'components/meshFilter',
        'components/meshRenderer',
        'graphics/mesh'
    ],
    function(
        _,
        Factory,
        BaseFactory,
        Material,
        Block,
        MeshFilter,
        MeshRenderer,
        Mesh
    ) {
        'use strict';
    
        var BlockFactory = function(context) {
            Factory.call(this, context);

            this.baseFactory = new BaseFactory(context);
        };

        BlockFactory.prototype = _.create(Factory.prototype, {
            construct: BlockFactory,

            create: function(name, texture, width, height, depth) {
                var entity = this.baseFactory.create(name);

                entity.setDimensions(width, height, depth);

                var material = new Material(Material.LAMBERT);
                material.diffuseMap = texture;

                entity.addComponent(new Block(texture));
                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));

                return entity;
            }
        });

        return BlockFactory;
    }
);
