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
        var Quad = function(width, height, sprite) {
            Component.call(this);

            this.width   = width;
            this.height  = height;

            this.mode    = Quad.MODE_SIMPLE;
            this.sprite  = sprite;
            this.texture = null;

            this.anchor  = new Vector3(0, 0, 0);
        };

        Quad.__name__ = 'Quad';

        Quad.prototype = _.create(Component.prototype, {
            constructor: Quad
        });

        Quad.MODE_SIMPLE = 'simple';
        Quad.MODE_SLICED = 'sliced';

        return Quad;
    }
);
