define([
        'lodash',
        'core/controller',
        'ui/uiStyle'
    ], 
    function(
        _,
        Controller,
        UIStyle
    ) {
        'use strict';

        /**
        *   This controller is for the UIButton component.
        *
        *   @class 
        *   @constructor
        *   @param {context}
        */
        var UIButtonController = function(context) {
            Controller.call(this, context);
        };

        UIButtonController.prototype = _.create(Controller.prototype, {
            constructor: UIButtonController,

            /**
            *   Update all entities which contain the UIButton components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'UIButton'], function(entity) {
                    var uiButton   = entity.getComponent('UIButton');
                    var dimensions = entity.getComponent('Dimensions');

                    if (uiButton.isDirty() || dimensions.isDirty()) {
                        var uiText = uiButton.getUITextComponent();

                        if (!uiText.isDirty()) {
                            this.updateButton(entity);
                        }
                    }
                }, this);
            },

            /**
            *   This method updates UIButton entities.
            *
            *   @method updateButton
            *   @param {entity}
            *   @returns {undefined}
            */
            updateButton: function(entity) {
                var uiButton           = entity.getComponent('UIButton');
                var uiButtonBounds     = entity.getComponent('Bounds');
                var uiButtonDimensions = entity.getComponent('Dimensions');
                var uiButtonCollider   = entity.getComponent('ColliderBox');

                var uiStyle            = uiButton.getCurrentStyle();
                var uiText             = uiButton.getUITextComponent();
                var uiRect             = uiButton.getUIRectComponent();
                var uiTextDimensions   = uiText.getComponent('Dimensions');
                var uiRectDimensions   = uiRect.getComponent('Dimensions');

                uiText.getComponent('Transform').setPosition(uiStyle.paddingLeft, -uiStyle.paddingTop);

                var width, height;
                switch (uiStyle.overflow) {
                    case UIStyle.OVERFLOW_NONE:
                        width  = Math.max(uiTextDimensions.getWidth(), uiButtonDimensions.getWidth());
                        height = Math.max(uiTextDimensions.getHeight(), uiButtonDimensions.getHeight());
                        break;
                    case UIStyle.OVERFLOW_HIDDEN:
                    case UIStyle.OVERFLOW_SCROLL:
                        width  = uiButtonDimensions.getWidth();
                        height = uiButtonDimensions.getHeight();
                        break;
                }

                width  += uiStyle.paddingLeft + uiStyle.paddingRight;
                height += uiStyle.paddingTop + uiStyle.paddingBottom;

                uiRectDimensions.setWidth(width);
                uiRectDimensions.setHeight(height);
                uiRect.setDirty(true);

                uiButtonCollider.setBoundingBox(uiRectDimensions.getComponent('Bounds').getLocalBoundingBox());
                uiButton.setDirty(false);
            }

        });

        return UIButtonController;
    }
);
