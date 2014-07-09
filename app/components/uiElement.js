define([
        'lodash',
        'core/component',
        'math/vector4'
    ],
    function(
        _,
        Component,
        Vector4
    ) {
        'use strict';

        /**
        *   UIElement component class.
        *
        *   @class 
        *   @constructor
        */
        var UIElement = function(uiElementStyle) {
            Component.call(this);

            this.uiElementStyle = uiElementStyle;
            this.state          = UIElement.STATE_NORMAL;
        };

        UIElement.__name__ = 'UIElement';

        UIElement.prototype = _.create(Component.prototype, {
            constructor: UIElement,

            /**
            *   This method updates the UIElement state and sets this component
            *   to dirty if the new state is different from the previous state.
            *
            *   @method setState
            *   @param {state}
            *   @returns {undefined}
            */
            setState: function(state) {
                if (this.state !== state) {
                    this.state = state;
                    this.setDirty(true);
                }
            },

            /**
            *   This method returns the current UIElement state.
            *
            *   @method getState
            *   @returns {string}
            */
            getState: function() {
                return this.state;
            },

            /**
            *   Check if this UIElement has the focus state
            *
            *   @method hasFocusState
            *   @returns {boolean}
            */
            hasFocusState: function() {
                return this.state === UIElement.STATE_FOCUS;
            },

            /**
            *   Check if this UIElement has the hover state
            *
            *   @method hasHoverState
            *   @returns {boolean}
            */
            hasHoverState: function() {
                return this.state === UIElement.STATE_HOVER;
            },

            /**
            *   Check if this UIElement has the active state
            *
            *   @method hasActiveState
            *   @returns {boolean}
            */
            hasActiveState: function() {
                return this.state === UIElement.STATE_ACTIVE;
            },

            /**
            *   This method returns the current UIStyle.
            *
            *   @method getCurrentStyle
            *   @returns {uiStyle}
            */
            getCurrentStyle: function() {
                switch (this.state) {
                    case UIElement.STATE_NORMAL:
                    return this.uiElementStyle.normal;
                    case UIElement.STATE_HOVER:
                    return this.uiElementStyle.hover;
                    case UIElement.STATE_ACTIVE:
                    return this.uiElementStyle.active;
                    case UIElement.STATE_FOCUS:
                    return this.uiElementStyle.focus;
                }
            },

            /**
            *   This method returns a background sprite for the current
            *   UIElement state.
            *
            *   @method getCurrentBackground
            *   @returns {sprite}
            */
            getCurrentBackground: function() {
                return this.getCurrentStyle().background;
            },

            /**
            *   This method handles input events for UIElements
            *
            *   @method handleState
            *   @param {event}
            *   @returns {undefined}
            */
            handleState: function(event) {
                throw 'UIElement: handleState() function not implemented.';
            },

        });

        UIElement.STATE_NORMAL = 'normal';
        UIElement.STATE_ACTIVE = 'active';
        UIElement.STATE_HOVER  = 'hover';
        UIElement.STATE_FOCUS  = 'focus';

        return UIElement;
    }
);
