define([
        'lodash',
        'core/component',
        'math/rectangle'
    ],
    function(
        _,
        Component,
        Rectangle
    ) {
        'use strict';

        /**
        *   The ScissorTest component class.
        *
        *   The scissor region defines a rectangle which constrains
        *   drawing. When the scissor test component is enabled only pixels
        *   that lie within the scissor box can be modified by drawing
        *   commands. When enabled drawing can only occur inside the
        *   intersection of the viewport, canvas area and the scissor box. When
        *   the scissor test is not enabled drawing can only occur inside the
        *   intersection of the viewport and canvas area.
        *
        *   @class 
        *   @constructor
        */
        var ScissorTest = function(enabled, rect) {
            Component.call(this);

            this.setEnabled(enabled);
            this.rectangle = rect || new Rectangle();
        };

        ScissorTest.__name__ = 'ScissorTest';

        ScissorTest.prototype = _.create(Component.prototype, {
            constructor: ScissorTest,

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
            *   This method sets the scissor rectangle for this entity.
            *
            *   @method setRectangle
            *   @param {x}
            *   @param {y}
            *   @param {width}
            *   @param {height}
            *   @returns {undefined}
            */
            setRectangle: function(x, y, width, height) {
                this.rectangle.set(x, y, width, height);
            },

            /**
            *   This method gets the scissor rectangle for this entity.
            *
            *   @method getRectangle
            *   @returns {undefined}
            */
            getRectangle: function() {
                return this.rectangle;
            }
        });

        return ScissorTest;
    }
);
