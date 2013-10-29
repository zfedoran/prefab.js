define([
    ],
    function(
    ) {

        var Component = function() {
            this._dirty = true;
            this._enabled = true;
        };

        Component.prototype = {
            constructor: Component,
            isDirty: function() {
                return this._dirty;
            },
            setDirty: function(value) {
                this._dirty = value;
            },
            isEnabled: function() {
                return this._enabled;
            },
            setEnabled: function(value) {
                this._enabled = value;
            }
        };

        return Component;
    }
);
