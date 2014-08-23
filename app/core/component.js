define([
        'lodash',
        'core/events'
    ],
    function(
        _,
        Events
    ) {
        'use strict';

        /**
        *   Abstract Component class. All entities are made up of zero or more
        *   components. 
        *
        *   @class
        *   @constructor 
        */
        var Component = function() {
            this._dirty = true;
            this._enabled = true;
        };

        Component.prototype = {
            constructor: Component,

            /**
            *   Abstract method for initializing this component. This method is
            *   called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            init: function(entity, context) {
                throw 'Component: init() function not implemented.';
            },

            /**
            *   Abstract method for uninitializing this component. This method
            *   is called when this component is removed from an entity.
            *
            *   @method uninitialize
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            uninitialize: function(entity, context) {
                throw 'Component: uninitialize() function not implemented.';
            },

            /**
            *   Helper method for checking if the component has been marked as
            *   dirty.
            *
            *   @method isDirty
            *   @returns {undefined}
            */
            isDirty: function() {
                return this._dirty;
            },

            /**
            *   Helper method for marking the component dirty or clean.
            *
            *   @method setDirty
            *   @param {value}
            *   @returns {undefined}
            */
            setDirty: function(value) {
                this._dirty = value;

                if (value === false) {
                    this.trigger('updated');
                }
            },

            /**
            *   Helper method for checking if the component is enabled.
            *
            *   @method isEnabled
            *   @returns {undefined}
            */
            isEnabled: function() {
                return this._enabled;
            },

            /**
            *   Helper method for setting this component to enabled or disabled.
            *
            *   @method setEnabled
            *   @param {value}
            *   @returns {undefined}
            */
            setEnabled: function(value) {
                this._enabled = value;
            }
        };

        _.extend(Component.prototype, Events.prototype);

        return Component;
    }
);
