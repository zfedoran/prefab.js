define([
        'lodash',
        'core/component',
        'graphics/material'
    ],
    function(
        _,
        Component,
        Material
    ) {
        'use strict';
    
        var MeshRenderer = function(material) {
            Component.call(this);

            this.castShadows = false;
            this.receiveShadows = false;
            this.material = material;
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
            }
        });

        return MeshRenderer;
    }
);
