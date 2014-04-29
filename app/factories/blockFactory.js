define([
        'lodash',
        'core/factory',
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
                var entity = this.getNewEntity();

                var material = new Material(Material.LAMBERT);

                entity.addComponent(new Transform());
                entity.addComponent(new Block(width, height, depth));
                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));

                return entity;
            }
        });

        return BlockFactory;
    }
);
