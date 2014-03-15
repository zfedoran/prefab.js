define([
        'lodash',
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
        Entity,
        Material,
        Transform,
        Block,
        MeshFilter,
        MeshRenderer,
        Mesh
    ) {
        'use strict';
    
        var BlockEntity = function(width, height, depth) {
            Entity.call(this);
            
            var material = new Material(Material.LAMBERT);

            this.addComponent(new Transform());
            this.addComponent(new Block(width, height, depth));
            this.addComponent(new MeshFilter());
            this.addComponent(new MeshRenderer(material));
        };

        BlockEntity.prototype = _.create(Entity.prototype, {
            construct: BlockEntity
        });

        return BlockEntity;
    }
);
