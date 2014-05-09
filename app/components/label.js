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
        var Label = function(text, fontFamily, fontSize, width, height, lineHeight) {
            Component.call(this);

            // If no width / height is provided, make this label size automatically
            this.width  = (typeof width  === 'undefined') ? 0 : width;
            this.height = (typeof height === 'undefined') ? 0 : height;

            // Use the internal 'auto' representation
            if (this.width === 'auto') { this.width = 0; }
            if (this.height === 'auto') { this.height = 0; }

            this.text = text;

            this.spriteFont = null;
            this.fontFamily = fontFamily || 'arial';
            this.fontSize   = fontSize || 10;
            this.lineHeight = lineHeight;
            this.textAlign  = Label.TEXT_ALIGN_LEFT;

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
            },

            /**
            *   This method sets this labels text to the provided string
            *
            *   @method setText
            *   @param {text}
            *   @returns {undefined}
            */
            setText: function(text) {
                this.text = text;
                this.setDirty(true);
            }

        });

        Label.TEXT_ALIGN_LEFT   = 'left';
        Label.TEXT_ALIGN_RIGHT  = 'right';
        Label.TEXT_ALIGN_CENTER = 'center';

        return Label;
    }
);
