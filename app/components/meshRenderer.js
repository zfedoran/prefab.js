define([
        'lodash',
        'math/rectangle',
        'core/component',
        'graphics/material'
    ],
    function(
        _,
        Rectangle,
        Component,
        Material
    ) {
        'use strict';
    
        var MeshRenderer = function(material) {
            Component.call(this);

            this.material       = material;

            this.castShadows    = false;
            this.receiveShadows = false;

            this.scissorRect    = new Rectangle();
            this.scissorEnabled = false;
        };

        MeshRenderer.__name__ = 'MeshRenderer';

        MeshRenderer.prototype = _.create(Component.prototype, {
            constructor: MeshRenderer,

            /**
            *   This method is called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            init: function(entity, context) {
            },

            /**
            *   This method is called when this component is removed from an
            *   entity.
            *
            *   @method uninitialize
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            uninitialize: function(entity, context) {
            },

            /**
            *   This method returns the current material used by this render
            *   component.
            *
            *   @method getMaterial
            *   @returns {undefined}
            */
            getMaterial: function() {
                return this.material;
            },

            /**
            *   This method sets the material this mesh renderer should use.
            *
            *   @method setMaterial
            *   @param {material}
            *   @returns {undefined}
            */
            setMaterial: function(material) {
                this.material = material;
            }
        });

        return MeshRenderer;
    }
);
