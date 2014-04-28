define([
        'lodash',
        'core/factory',
        'core/entity',
        'graphics/material',
        'components/transform',
        'components/block',
        'components/meshFilter',
        'components/meshRenderer',
        'graphics/mesh'
    ],
    function(
        _,
        Factory,
        Entity,
        Material,
        Transform,
        Block,
        MeshFilter,
        MeshRenderer,
        Mesh
    ) {
        'use strict';
    
        var BlockFactory = function(context) {
            Factory.call(this, context);
        };

        BlockFactory.prototype = _.create(Factory.prototype, {
            construct: BlockFactory,

            create: function(width, height, depth) {
                var entity = new Entity();

                var material = new Material(Material.LAMBERT);

                entity.addComponent(new Transform());
                entity.addComponent(new Block(width, height, depth));
                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));

                this.addEntity(entity);

                return entity;
            }
        });

        return BlockFactory;
    }
);
