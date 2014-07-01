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
        *   @param {width}
        *   @param {height}
        *   @param {sprite}
        *   @constructor
        */
        var Quad = function(sprite, width, height) {
            Component.call(this);

            this.width   = typeof width === 'undefined' ? 0 : width;
            this.height  = typeof height === 'undefined' ? 0 : height;

            this.mode    = Quad.MODE_SIMPLE;
            this.sprite  = sprite;
            this.texture = null;

            this.anchor  = new Vector3(0, 0, 0);
        };

        Quad.__name__ = 'Quad';

        Quad.prototype = _.create(Component.prototype, {
            constructor: Quad,

            setSprite: function(sprite) {
                this.sprite = sprite; 
                this.setDirty(true);
            },

            useSlicedMode: function() { 
                this.mode = Quad.MODE_SLICED;
                this.setDirty(true);
            },

            useSimpleMode: function() { 
                this.mode = Quad.MODE_SIMPLE;
                this.setDirty(true);
            },

        });

        Quad.MODE_SIMPLE = 'simple';
        Quad.MODE_SLICED = 'sliced';

        return Quad;
    }
);
