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

            this.width   = typeof width === 'undefined' ? 'auto' : width;
            this.height  = typeof height === 'undefined' ? 'auto' : height;

            // Internal width and height values
            this._width  = 0;
            this._height = 0;

            this.mode    = Quad.MODE_SIMPLE;
            this.sprite  = sprite;
            this.texture = null;

            this.anchor  = new Vector3(0, 0, 0);
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
            },

            /**
            *   Use "sliced" mode when generating the mesh for this quad. The
            *   quad will actually have 18 triangles or 9 quads (Useful for UI
            *   where you don't want the borders to stretch).
            *
            *   Vertices will be generated as follows. Note that only the
            *   center quad will be affected by the width and height, the
            *   others will be sized using the pixel size of the attached
            *   sprite.
            *
            *    1---2------3---4
            *    | / |  /   | / |
            *    5---6------7---8
            *    | / |    / | / |
            *    |   |  /   |   |
            *    9--10-----11--12
            *    | / |  /   | / |
            *    13-14-----15--16
            *
            *   @method useSlicedMode
            *   @returns {undefined}
            */
            useSlicedMode: function() { 
                this.mode = Quad.MODE_SLICED;
                this.setDirty(true);
            },

            /**
            *   Use "simple" mode when generating the mesh for this quad. Only
            *   2 triangles will be used.
            *
            *   @method useSimpleMode
            *   @returns {undefined}
            */
            useSimpleMode: function() { 
                this.mode = Quad.MODE_SIMPLE;
                this.setDirty(true);
            },

            /**
            *   Set the width value for this quad.
            *
            *   @method setWidth
            *   @param {width}
            *   @returns {undefined}
            */
            setWidth: function(width) {
                this.width = width;
                this.setDirty(true);
            },

            /**
            *   Set the height value for this quad.
            *
            *   @method setHeight
            *   @param {height}
            *   @returns {undefined}
            */
            setHeight: function(height) {
                this.height = height;
                this.setDirty(true);
            },


            /**
            *   This method returns the computed width value (useful when using
            *   auto widths).
            *
            *   @method getComputedWidth
            *   @returns {number}
            */
            getComputedWidth: function() {
                return this._width;
            },

            /**
            *   This method returns the computed height value (useful when using
            *   auto heights).
            *
            *   @method getComputedHeight
            *   @returns {number}
            */
            getComputedHeight: function() {
                return this._height;
            },

        });

        Quad.MODE_SIMPLE = 'simple';
        Quad.MODE_SLICED = 'sliced';

        return Quad;
    }
);
