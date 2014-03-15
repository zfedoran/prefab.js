define([
        'lodash',
        'core/entity',
        'graphics/material',
        'components/transform',
        'editor/components/grid',
        'components/meshFilter',
        'components/meshRenderer',
        'graphics/mesh'
    ],
    function(
        _,
        Entity,
        Material,
        Transform,
        Grid,
        MeshFilter,
        MeshRenderer,
        Mesh
    ) {
        'use strict';
    
        var GridEntity = function(width, height, depth) {
            Entity.call(this);

            var material = new Material(Material.BASIC);

            this.addComponent(new Transform());
            this.addComponent(new Grid(width, height, depth));
            this.addComponent(new MeshFilter());
            this.addComponent(new MeshRenderer(material));
        };

        GridEntity.prototype = _.create(Entity.prototype, {
            constructor: GridEntity
        });

        return GridEntity;
    }
);
