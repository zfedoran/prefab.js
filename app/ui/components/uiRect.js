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
        *   UIRect component class.
        *
        *   Any entity with a UIRect component will have its MeshFilter
        *   automatically updated with a matching quad Mesh.
        *
        *   @class 
        *   @param {sprite}
        *   @constructor
        */
        var UIRect = function(uiElementStyle) {
            UIElement.call(this, uiElementStyle);

            this.mode    = UIRect.MODE_SLICED;
            this.sprite  = this.getCurrentStyle().background;
            this.texture = this.sprite.getTexture();
        };

        UIRect.__name__ = 'UIRect';

        UIRect.prototype = _.create(UIElement.prototype, {
            constructor: UIRect,

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
            *   Set the sprite to use for this quad.
            *
            *   @method setSprite
            *   @param {sprite}
            *   @returns {undefined}
            */
            setSprite: function(sprite) {
                this.sprite = sprite; 
                this.setDirty(true);
            },

            /**
            *   Use "sliced" mode when generating the mesh for this quad. The
            *   quad will actually have 18 triangles or 9 quads (Useful for UI
            *   where you don't want the borders to stretch).
            *
            *   Vertices will be generated as follows. Note that only the
            *   center quad will be affected by the width and height, the
            *   others will be sized using the pixel size of the attached
            *   sprite.
            *
            *    1---2------3---4
            *    | / |  /   | / |
            *    5---6------7---8
            *    | / |    / | / |
            *    |   |  /   |   |
            *    9--10-----11--12
            *    | / |  /   | / |
            *    13-14-----15--16
            *
            *   @method useSlicedMode
            *   @returns {undefined}
            */
            useSlicedMode: function() { 
                this.mode = UIRect.MODE_SLICED;
                this.setDirty(true);
            },

            /**
            *   Use "simple" mode when generating the mesh for this quad. Only
            *   2 triangles will be used.
            *
            *   @method useSimpleMode
            *   @returns {undefined}
            */
            useSimpleMode: function() { 
                this.mode = UIRect.MODE_SIMPLE;
                this.setDirty(true);
            }
        });

        UIRect.MODE_SIMPLE = 'simple';
        UIRect.MODE_SLICED = 'sliced';

        return UIRect;
    }
);
