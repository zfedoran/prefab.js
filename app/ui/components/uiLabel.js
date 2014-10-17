define([
        'lodash',
        'math/vector3',
        'ui/components/uiElement'
    ],
    function(
        _,
        Vector3,
        UIElement
    ) {
        'use strict';

        /**
        *   UILabel component class.
        *
        *   Any entity with a UILabel component will have its MeshFilter
        *   automatically updated with a matching quad Mesh.
        *
        *   @class 
        *   @param {text}
        *   @param {uiElementStyle}
        *   @constructor
        */
        var UILabel = function(text, uiElementStyle) {
            UIElement.call(this, uiElementStyle);

            this.text         = text;
            this.multiLine    = false;
        };

        UILabel.__name__ = 'UILabel';

        UILabel.prototype = _.create(UIElement.prototype, {
            constructor: UILabel,

            /**
            *   This method is called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            init: function(entity, context) {
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
            },

            /**
            *   This method sets this labels text to the provided string
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
            *   This method gets the labels text.
            *
            *   @method getText
            *   @returns {undefined}
            */
            getText: function() {
                return this.text;
            }
        });

        return UILabel;
    }
);
