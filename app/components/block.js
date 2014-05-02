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
        var Block = function(width, height, depth) {
            Component.call(this);

            this.width  = width;
            this.height = height;
            this.depth  = depth;

            this.top    = null;
            this.bottom = null;
            this.left   = null;
            this.right  = null;
            this.front  = null;
            this.back   = null;

            this.texture = null;

            this.anchor  = new Vector3(0, 0, 0);
        };

        Block.__name__ = 'Block';

        Block.prototype = _.create(Component.prototype, {
            constructor: Block,

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
