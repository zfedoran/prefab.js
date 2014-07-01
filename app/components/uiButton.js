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
        *   UIButton component class.
        *
        *   @class 
        *   @constructor
        */
        var UIButton = function(text, uiElementStyle) {
            Component.call(this);

            this.text           = text;

            // TODO: put these into UIElement and inherit from it
            this.uiElementStyle = uiElementStyle;
            this.state          = UIButton.STATE_NORMAL;
        };

        UIButton.__name__ = 'UIButton';

        UIButton.prototype = _.create(Component.prototype, {
            constructor: UIButton,

            setNormalState: function() {
                this.state = UIButton.STATE_NORMAL;
                this.setDirty(true);
            },

            setActiveState: function() {
                this.state = UIButton.STATE_ACTIVE;
                this.setDirty(true);
            },

            setHoverState: function() {
                this.state = UIButton.STATE_HOVER;
                this.setDirty(true);
            },

            setFocusState: function() {
                this.state = UIButton.STATE_FOCUS;
                this.setDirty(true);
            },

            setState: function(state) {
                this.state = state;
                this.setDirty(true);
            },

            getState: function() {
                return this.state;
            },

            getCurrentSprite: function() {
                switch (this.state) {
                    case UIButton.STATE_NORMAL:
                    return this.uiElementStyle.normal;
                    case UIButton.STATE_ACTIVE:
                    return this.uiElementStyle.active;
                    case UIButton.STATE_HOVER:
                    return this.uiElementStyle.hover;
                    case UIButton.STATE_FOCUS:
                    return this.uiElementStyle.focus;
                }
            }

        });

        UIButton.STATE_NORMAL = 'normal';
        UIButton.STATE_ACTIVE = 'active';
        UIButton.STATE_HOVER  = 'hover';
        UIButton.STATE_FOCUS  = 'focus';

        return UIButton;
    }
);
