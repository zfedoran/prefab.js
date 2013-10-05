define([
    ],
    function(
    ) {

        var Component = function() {
            this._dirty = false;
        };

        Component.prototype = {
            constructor: Component,
            isDirty: function() {
                return this._dirty;
            },
            setDirty: function(value) {
                this._dirty = value;
            }
        };

        return Component;
    }
);
