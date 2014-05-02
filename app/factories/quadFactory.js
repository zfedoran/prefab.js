define([
        'lodash',
        'core/factory',
        'graphics/material',
        'components/transform',
        'components/quad',
        'components/meshFilter',
        'components/meshRenderer',
        'graphics/mesh'
    ],
    function(
        _,
        Factory,
        Material,
        Transform,
        Quad,
        MeshFilter,
        MeshRenderer,
        Mesh
    ) {
        'use strict';
    
        var QuadFactory = function(context) {
            Factory.call(this, context);
        };

        QuadFactory.prototype = _.create(Factory.prototype, {
            construct: QuadFactory,

            create: function(width, height, sprite) {
                var entity = this.context.createNewEntity();

                var material = new Material(Material.LAMBERT);

                entity.addComponent(new Transform());
                entity.addComponent(new Quad(width, height, sprite));
                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));

                return entity;
            }
        });

        return QuadFactory;
    }
);
