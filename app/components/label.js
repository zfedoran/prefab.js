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
        *   Label component class.
        *
        *   Any entity with a Label component will have its MeshFilter
        *   automatically updated with a matching quad Mesh.
        *
        *   @class 
        *   @param {width}
        *   @param {height}
        *   @param {sprite}
        *   @constructor
        */
        var Label = function(text, width, height, fontFamily, fontSize, lineHeight) {
            Component.call(this);

            this.width   = width;
            this.height  = height;

            this.text = text;

            this.spriteFont = null;
            this.fontFamily = fontFamily || 'arial';
            this.fontSize   = fontSize || 10;
            this.lineHeight = lineHeight;

            this.anchor  = new Vector3(0, 0, 0);
        };

        Label.__name__ = 'Label';

        Label.prototype = _.create(Component.prototype, {
            constructor: Label,

            /**
            *   This method returns the font-family name.
            *
            *   @method getFontName
            *   @returns {undefined}
            */
            getFontName: function(label) {
                return this.fontSize + 'px ' + this.fontFamily;
            }

        });

        return Label;
    }
);
