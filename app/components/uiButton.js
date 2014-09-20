define([
        'lodash',
        'components/uiElement',
        'math/vector4'
    ],
    function(
        _,
        UIElement,
        Vector4
    ) {
        'use strict';

        /**
        *   UIButton component class.
        *
        *   @class 
        *   @constructor
        */
        var UIButton = function(text, uiElementStyle) {
            UIElement.call(this, uiElementStyle);

            this.text = text;
        };

        UIButton.__name__ = 'UIButton';

        UIButton.prototype = _.create(UIElement.prototype, {
            constructor: UIButton,

            /**
            *   This method is called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @returns {undefined}
            */
            init: function(entity, context) {
                // Entity Events
                entity.on('mouseenter', this.onEntityMouseEnter, this);
                entity.on('mouseleave', this.onEntityMouseLeave, this);
                entity.on('mousedown', this.onEntityMouseDown, this);

                // Input Device Events
                var mouseDevice = context.getMouseDevice();

                mouseDevice.on('mouseup', this.onDeviceMouseUp, this);
            },

            /**
            *   This method is called when this component is removed from an
            *   entity.
            *
            *   @method uninitialize
            *   @param {entity}
            *   @returns {undefined}
            */
            uninitialize: function(entity, context) {
                // Entity Events
                entity.off('mouseenter', this.onEntityMouseEnter, this);
                entity.off('mouseleave', this.onEntityMouseLeave, this);
                entity.off('mousedown', this.onEntityMouseDown, this);

                // Input Device Events
                var mouseDevice = context.getMouseDevice();

                mouseDevice.off('mouseup', this.onDeviceMouseUp, this);
            },

            /**
            *   This method sets this button text to the provided string
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
            *   This method handles the mouseenter event.
            *
            *   @method onEntityMouseEnter
            *   @param {mouseDevice}
            *   @returns {undefined}
            */
            onEntityMouseEnter: function(mouseDevice) {
                if (this.state === UIElement.STATE_NORMAL) {
                    this.setState(UIElement.STATE_HOVER);
                }
            },

            /**
            *   This method handles the mouseleave event.
            *
            *   @method onEntityMouseLeave
            *   @param {mouseDevice}
            *   @returns {undefined}
            */
            onEntityMouseLeave: function(mouseDevice) {
                if (this.state === UIElement.STATE_HOVER) {
                    this.setState(UIElement.STATE_NORMAL);
                }
            },

            /**
            *   This method handles the mouseleave event.
            *
            *   @method onEntityMouseDown
            *   @param {mouseDevice}
            *   @returns {undefined}
            */
            onEntityMouseDown: function(mouseDevice) {
                mouseDevice.stopEventPropagation();

                if (this.state === UIElement.STATE_HOVER) {
                    this.setState(UIElement.STATE_ACTIVE);
                }
            },

            /**
            *   This method handles the mouseup event.
            *
            *   @method onDeviceMouseUp
            *   @returns {undefined}
            */
            onDeviceMouseUp: function() {
                if (this.state === UIElement.STATE_ACTIVE) {
                    this.setState(UIElement.STATE_HOVER);
                }
            },
        });

        return UIButton;
    }
);
