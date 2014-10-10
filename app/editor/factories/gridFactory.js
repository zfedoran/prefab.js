define([
        'lodash',
        'core/factory',
        'graphics/material',
        'graphics/mesh',
        'components/transform',
        'components/meshFilter',
        'components/meshRenderer',
        'editor/components/grid',
    ],
    function(
        _,
        Factory,
        Material,
        Mesh,
        Transform,
        MeshFilter,
        MeshRenderer,
        Grid
    ) {
        'use strict';
    
        /**
        *   Factory for creating grid entities.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var GridFactory = function(context) {
            Factory.call(this, context);
        };

        GridFactory.prototype = _.create(Factory.prototype, {
            construct: GridFactory,

            /**
            *   Generates a grid entity.
            *
            *   @method create
            *   @param {width} Width of the grid
            *   @param {height} Height of the grid
            *   @param {depth} Depth of the grid
            *   @returns {undefined}
            */
            create: function(name, width, height, depth) {
                var entity = this.context.createNewEntity(name);

                var material = new Material(Material.BASIC);
                material.diffuse.set(1, 1, 1, 1);

                entity.addComponent(new Transform());
                entity.addComponent(new Grid(width, height, depth));
                entity.addComponent(new MeshFilter());
                entity.addComponent(new MeshRenderer(material));

                return entity;
            }
        });

        return GridFactory;
    }
);
