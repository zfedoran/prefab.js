define([
        'jquery',
        'lodash'
    ],
    function(
        $,
        _
    ) {
        'use strict';

        /**
        *   The SaveAsFileDialog class hides some of the Node-Webkit file
        *   dialog nastiness.
        *
        *   @class 
        *   @constructor
        */
        var SaveAsFileDialog = function() {
        };

        SaveAsFileDialog.prototype = {
            constructor: SaveAsFileDialog,

            /**
            *   This method initializes a new save as dialog.
            *
            *   @method init
            *   @param {filename}
            *   @returns {undefined}
            */
            init: function(filename) {
                this.$el = $('<input style="display:none;" type="file" nwsaveas="' + filename + '">');
            },

            /**
            *   This method triggers the save as dialog and calls the provided
            *   callback once the user selects a file.
            *
            *   @method trigger
            *   @param {callback}
            *   @returns {undefined}
            */
            trigger: function(callback) {
                this.$el.on('change', (function() {
                    this.$el.off('change');
                    callback(this.$el.val());
                }).bind(this));
                this.$el.trigger('click');
            },

            /**
            *   This method removes the file dialog.
            *
            *   @method destroy
            *   @returns {undefined}
            */
            destroy: function() {
                this.$el.remove();
            }
        };

        return SaveAsFileDialog;
    }
);
