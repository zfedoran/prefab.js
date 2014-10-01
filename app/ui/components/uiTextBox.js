define([
        'lodash',
        'math/vector4',
        'ui/components/uiElement'
    ],
    function(
        _,
        Vector4,
        UIElement
    ) {
        'use strict';

        /**
        *   UITextBox component class.
        *
        *   @class 
        *   @constructor
        */
        var UITextBox = function(text, uiElementStyle) {
            UIElement.call(this, uiElementStyle);

            this.text = text;

            this._cursorPosition   = 0;
            this._cursorBlinkTime  = 0;
            this._cursorBlinkDelay = 1;
        };

        UITextBox.__name__ = 'UITextBox';

        UITextBox.prototype = _.create(UIElement.prototype, {
            constructor: UITextBox,

            /**
            *   This method is called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            init: function(entity, context) {
                this._context = context;

                // Global Events
                context.on('blur', this.onGlobalBlurEvent, this);

                // Entity Events
                entity.on('mouseenter', this.onEntityMouseEnter, this);
                entity.on('mouseleave', this.onEntityMouseLeave, this);
                entity.on('mousedown', this.onEntityMouseDown, this);

                // Input Device Events
                var keyboardDevice = context.getKeyboardDevice();
                var mouseDevice    = context.getMouseDevice();

                mouseDevice.on('mousedown', this.onDeviceMouseDown, this);
                mouseDevice.on('mouseup', this.onDeviceMouseUp, this);
                keyboardDevice.on('keydown', this.onDeviceKeyDown, this);
                keyboardDevice.on('keyup', this.onDeviceKeyUp, this);
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
                // Global Events
                context.off('blur', this.onGlobalBlurEvent, this);

                // Entity Events
                entity.off('mouseenter', this.onEntityMouseEnter, this);
                entity.off('mouseleave', this.onEntityMouseLeave, this);
                entity.off('mousedown', this.onEntityMouseDown, this);

                // Input Device Events
                var keyboardDevice = context.getKeyboardDevice();
                var mouseDevice    = context.getMouseDevice();

                mouseDevice.off('mousedown', this.onDeviceMouseDown, this);
                mouseDevice.off('mouseup', this.onDeviceMouseUp, this);
                keyboardDevice.off('keydown', this.onDeviceKeyDown, this);
                keyboardDevice.off('keyup', this.onDeviceKeyUp, this);
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
            *   This method adds time to the cursor clock.
            *
            *   @method addCursorTime
            *   @param {elapsed}
            *   @returns {undefined}
            */
            addCursorTime: function(elapsed) {
                if (this.hasFocusState()) {
                    this._cursorBlinkTime += elapsed;
                    if (this._cursorBlinkTime > this._cursorBlinkDelay) {
                        this._cursorBlinkTime = 0;
                    }
                }
            },

            /**
            *   Check if the cursor for this UITextBox component is visible.
            *
            *   @method isCursorVisible
            *   @returns {undefined}
            */
            isCursorVisible: function() {
                return this.hasFocusState() 
                    && this._cursorBlinkTime > (this._cursorBlinkDelay / 2);
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
            *   This method handles the mousedown event.
            *
            *   @method onEntityMouseDown
            *   @param {mouseDevice}
            *   @returns {undefined}
            */
            onEntityMouseDown: function(mouseDevice) {
                mouseDevice.stopEventPropagation();

                if (this.state === UIElement.STATE_HOVER) {
                    this.setState(UIElement.STATE_ACTIVE);
                    this._context.trigger('blur');
                } else {
                    this.isCursorPositionUpdate = true;
                }
            },

            /**
            *   This method handles the mousedown event.
            *
            *   @method onDeviceMouseDown
            *   @returns {undefined}
            */
            onDeviceMouseDown: function() {
                // If this entity is focused AND another entity was clicked on
                if (this.state === UIElement.STATE_FOCUS 
                && !this.isCursorPositionUpdate) {
                    this.setState(UIElement.STATE_NORMAL);
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
                    this.setState(UIElement.STATE_FOCUS);
                }
                this.isCursorPositionUpdate = false;
            },

            /**
            *   This method handles the blur event.
            *
            *   @method onGlobalBlurEvent
            *   @returns {undefined}
            */
            onGlobalBlurEvent: function() {
                if (this.state === UIElement.STATE_FOCUS) {
                    this.setState(UIElement.STATE_NORMAL);
                }
            },

            /**
            *   This method handles the keyup event.
            *
            *   @method onDeviceKeyUp
            *   @returns {undefined}
            */
            onDeviceKeyUp: function(keyboardDevice) {
                // TODO: do we need anything here?
            },

            /**
            *   This method handles the keydown event.
            *
            *   @method onDeviceKeyDown
            *   @returns {undefined}
            */
            onDeviceKeyDown: function(keyboardDevice) {
                if (this.state === UIElement.STATE_FOCUS) {
                    // TODO: add ability to hold down a button to trigger it multiple times

                    if (keyboardDevice.currentKey === keyboardDevice.keyCodes.Backspace) {
                        this.text = this.text.slice(0, this.text.length - 1);
                    } else {
                        this.text += keyboardDevice.currentChar;
                    }
                    this.setDirty(true);
                }
            },
        });

        return UITextBox;
    }
);
