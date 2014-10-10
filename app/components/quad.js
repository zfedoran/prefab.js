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
        *   Quad component class.
        *
        *   Any entity with a Quad component will have its MeshFilter
        *   automatically updated with a matching quad Mesh.
        *
        *   @class 
        *   @param {sprite}
        *   @constructor
        */
        var Quad = function(sprite) {
            Component.call(this);

            this.sprite  = sprite;
            this.texture = null;
        };

        Quad.__name__ = 'Quad';

        Quad.prototype = _.create(Component.prototype, {
            constructor: Quad,

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
            *   Set the sprite to use for this quad.
            *
            *   @method setSprite
            *   @param {sprite}
            *   @returns {undefined}
            */
            setSprite: function(sprite) {
                this.sprite = sprite; 
                this.setDirty(true);
            }
        });

        return Quad;
    }
);
