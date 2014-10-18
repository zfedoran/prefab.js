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
                        var uiLabel = uiButton.getUILabelComponent();

                        if (!uiLabel.isDirty()) {
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
                var uiLabel            = uiButton.getUILabelComponent();
                var uiRect             = uiButton.getUIRectComponent();
                var uiLabelBounds      = uiLabel.getComponent('Bounds');
                var uiRectDimensions   = uiRect.getComponent('Dimensions');

                uiLabel.getComponent('Transform').setPosition(uiStyle.paddingLeft, -uiStyle.paddingTop);

                var width, height;
                if (uiStyle.autoWidth) {
                    width = Math.max(uiLabelBounds.getLocalWidth(), uiButtonDimensions.getWidth());
                } else {
                    width = uiButtonDimensions.getWidth();
                }

                if (uiStyle.autoHeight) {
                    height = Math.max(uiLabelBounds.getLocalHeight(), uiButtonDimensions.getHeight());
                } else {
                    height = uiButtonDimensions.getHeight();
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
