define([
        'core/component',
        'core/guiStyle'
    ],
    function(
        Component,
        GUIStyle
    ) {

        var GUIElement = function(rect) {
            Component.call(this);

            this.boundingBox = rect;

            this.styleDefault = new GUIStyle();
            this.styleHover   = new GUIStyle();
            this.styleActive  = new GUIStyle();
            this.styleFocus   = new GUIStyle();

            this.currentStyleState = GUIElement.DEFAULT_STATE;
            this.currentStyle = this.styleDefault;

            this.setDirty(true);
        };

        GUIElement.__name__ = 'GUIElement';

        GUIElement.prototype = Object.create(Component.prototype);

        GUIElement.prototype.constructor = GUIElement;

        GUIElement.prototype.hitTest = function(position) {
            return this.boundingBox.contains(position);
        };

        GUIElement.prototype.getCurrentStyle = function() {
            return this.currentStyle;
        };

        GUIElement.DEFAULT_STATE = 'default';
        GUIElement.HOVER_STATE   = 'hover';
        GUIElement.ACTIVE_STATE  = 'active';
        GUIElement.FOCUS_STATE   = 'focus';

        return GUIElement;
    }
);
