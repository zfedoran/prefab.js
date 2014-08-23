define([
        'lodash',
        'core/component',
        'math/vector3',
        'input/keyboardDevice'
    ],
    function(
        _,
        Component,
        Vector3,
        KeyboardDevice
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
            
            // Internal width and height values
            this._width  = 0;
            this._height = 0;

            this.text = text;

            this.spriteFont  = null;
            this.fontFamily  = fontFamily || 'arial';
            this.fontSize    = fontSize || 10;
            this.lineHeight  = lineHeight;
            this.textAlign   = Label.TEXT_ALIGN_LEFT;

            // The following properties change how the dynamic spriteFont is generated
            this.antiAlias    = true;
            this.invertColors = true; // Webkit seems to be better at rendering black font against white in the canvas element.

            this.anchor  = new Vector3(0, 0, 0);
        };

        Label.__name__ = 'Label';

        Label.prototype = _.create(Component.prototype, {
            constructor: Label,

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
            *   This method returns the font-family name.
            *
            *   @method getFontName
            *   @returns {undefined}
            */
            getFontName: function(label) {
                return this.fontSize + 'px ' + this.fontFamily + ' ' + this.antiAlias + ' ' + this.invertColors;
            },

            /**
            *   This method sets this labels text to the provided string
            *
            *   @method setText
            *   @param {text}
            *   @returns {undefined}
            */
            setText: function(text) {
                this.text = text + '';
                this.setDirty(true);
            },

            /**
            *   Set the width value for this label.
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
            *   Set the height value for this label.
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

        Label.TEXT_ALIGN_LEFT   = 'left';
        Label.TEXT_ALIGN_RIGHT  = 'right';
        Label.TEXT_ALIGN_CENTER = 'center';

        return Label;
    }
);
