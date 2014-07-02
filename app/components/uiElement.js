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
        var UIElement = function(uiStyle) {
            Component.call(this);

            this.uiStyle = uiStyle;
            this.state   = UIElement.STATE_NORMAL;
        };

        UIElement.__name__ = 'UIElement';

        UIElement.prototype = _.create(Component.prototype, {
            constructor: UIElement,

            setNormalState: function() {
                this.state = UIElement.STATE_NORMAL;
                this.setDirty(true);
            },

            setActiveState: function() {
                this.state = UIElement.STATE_ACTIVE;
                this.setDirty(true);
            },

            setHoverState: function() {
                this.state = UIElement.STATE_HOVER;
                this.setDirty(true);
            },

            setFocusState: function() {
                this.state = UIElement.STATE_FOCUS;
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
                    case UIElement.STATE_NORMAL:
                    return this.uiStyle.normal;
                    case UIElement.STATE_ACTIVE:
                    return this.uiStyle.active;
                    case UIElement.STATE_HOVER:
                    return this.uiStyle.hover;
                    case UIElement.STATE_FOCUS:
                    return this.uiStyle.focus;
                }
            }

        });

        UIElement.STATE_NORMAL = 'normal';
        UIElement.STATE_ACTIVE = 'active';
        UIElement.STATE_HOVER  = 'hover';
        UIElement.STATE_FOCUS  = 'focus';

        return UIElement;
    }
);
