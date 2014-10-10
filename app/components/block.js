define([
        'lodash',
        'core/component',
        'math/vector3'
    ],
    function(
        _,
        Component,
        Vector3
    ) {
        'use strict';

        /**
        *   Block component class.
        *
        *   Any entity with a block component will have its MeshFilter
        *   automatically updated with a matching box Mesh.
        *
        *   @class 
        *   @param {width}
        *   @param {height}
        *   @param {depth}
        *   @constructor
        */
        var Block = function(texture) {
            Component.call(this);

            // Get a full texture sprite
            var sprite  = texture.getFullTextureSprite();

            this.top    = sprite;
            this.bottom = sprite;
            this.left   = sprite;
            this.right  = sprite;
            this.front  = sprite;
            this.back   = sprite;

            this.texture = texture;
        };

        Block.__name__ = 'Block';

        Block.prototype = _.create(Component.prototype, {
            constructor: Block,

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
            *   This method sets all block faces to the provided sprite.
            *
            *   @method setAllFacesTo
            *   @param {sprite}
            *   @returns {undefined}
            */
            setAllFacesTo: function(sprite) {
                this.front   = sprite;
                this.left    = sprite;
                this.back    = sprite;
                this.right   = sprite;
                this.top     = sprite;
                this.bottom  = sprite;
                this.texture = sprite.texture;
            }
        });

        return Block;
    }
);
