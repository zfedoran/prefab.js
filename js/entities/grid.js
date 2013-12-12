define([
        'core/entity',
        'graphics/material',
        'components/transform',
        'components/block',
        'components/meshFilter',
        'components/meshRenderer',
        'graphics/mesh'
    ],
    function(
        Entity,
        Transform,
        Material,
        Grid,
        MeshFilter,
        MeshRenderer,
        Mesh
    ) {
        'use strict';
    
        var BlockEntity = function(width, height, depth) {
            Entity.call(this);

            var material = new Material(Material.BASIC);

            this.addComponent(new Transform());
            this.addComponent(new Grid(width, height, depth));
            this.addComponent(new MeshFilter());
            this.addComponent(new MeshRenderer(material));
        };

        BlockEntity.prototype = Object.create(Entity.prototype);

        BlockEntity.prototype.constructor = BlockEntity;

        return BlockEntity;
    }
);
