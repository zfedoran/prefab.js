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
        *   This controller is for the UITextBox component.
        *
        *   @class 
        *   @constructor
        *   @param {context}
        */
        var UITextBoxController = function(context) {
            Controller.call(this, context);
        };

        UITextBoxController.prototype = _.create(Controller.prototype, {
            constructor: UITextBoxController,

            /**
            *   Update all entities which contain the UITextBox components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function(elapsed) {
                this.elapsed = elapsed;

                this.filterBy(['Transform', 'UITextBox', 'ColliderBox'], function(entity) {
                    var uiTextBox  = entity.getComponent('UITextBox');
                    var dimensions = entity.getComponent('Dimensions');

                    if (uiTextBox.isDirty() || dimensions.isDirty()) {
                        var uiLabel = uiTextBox.getUILabelComponent();

                        if (!uiLabel.isDirty()) {
                            this.updateTextBox(entity);
                        }
                    }

                    this.updateCursor(entity);
                }, this);
            }, 

            /**
            *   This method updates the input entity and its children.
            *
            *   @method updateTextBox
            *   @param {entity}
            *   @returns {undefined}
            */
            updateTextBox: function(entity) {
                var uiTextBox             = entity.getComponent('UITextBox');
                var uiTextBoxBounds       = entity.getComponent('Bounds');
                var uiTextBoxDimensions   = entity.getComponent('Dimensions');
                var uiTextBoxCollider     = entity.getComponent('ColliderBox');
                var uiTextBoxTransform    = entity.getComponent('Transform');
                var uiTextBoxScissor      = entity.getComponent('ScissorTest');

                var uiStyle               = uiTextBox.getCurrentStyle();
                var cursorQuad            = uiTextBox.getCursorQuadComponent();
                var uiLabel               = uiTextBox.getUILabelComponent();
                var uiRect                = uiTextBox.getUIRectComponent();
                var uiLabelBounds         = uiLabel.getComponent('Bounds');
                var uiRectDimensions      = uiRect.getComponent('Dimensions');

                // Label position
                uiLabel.getComponent('Transform').setPosition(uiStyle.paddingLeft, -uiStyle.paddingTop);

                // TextBox width
                var width, height;
                if (uiStyle.autoWidth) {
                    width = Math.max(uiLabelBounds.getWidth(), uiTextBoxDimensions.getWidth());
                } else {
                    width = uiTextBoxDimensions.getWidth();
                }

                // TextBox height
                if (uiStyle.autoHeight) {
                    height = Math.max(uiLabelBounds.getHeight(), uiTextBoxDimensions.getHeight());
                } else {
                    height = uiTextBoxDimensions.getHeight();
                }

                // Update the cursor
                if (uiTextBox.hasFocusState()) {
                    // Update cursor color
                    var cursorMaterial     = cursorQuad.getComponent('MeshRenderer').material;
                    cursorMaterial.diffuse = uiStyle.fontColor;

                    // Update cursor position
                    var dx = uiTextBox.getCurrentCursorOffset() + uiStyle.paddingLeft;
                    var dy = height / 2;
                    cursorQuad.getComponent('Transform').setPosition(dx, -dy, 0);
                }

                width  += uiStyle.paddingLeft + uiStyle.paddingRight;
                height += uiStyle.paddingTop + uiStyle.paddingBottom;

                uiRectDimensions.setWidth(width);
                uiRectDimensions.setHeight(height);
                uiRect.setDirty(true);

                uiTextBoxCollider.setBoundingBox(uiRectDimensions.getComponent('Bounds').getLocalBoundingBox());

                var boundingBox = uiRectDimensions.getComponent('Bounds').getWorldBoundingBox();
                uiTextBoxScissor.setRectangle(boundingBox.min.x, 
                                              boundingBox.min.y, 
                                              boundingBox.getWidth(), 
                                              boundingBox.getHeight());

                uiTextBox.setDirty(false);
            },

            /**
            *   This method controls the UITextBox blinking cursor.
            *
            *   @method updateCursor
            *   @param {entity}
            *   @returns {undefined}
            */
            updateCursor: function(entity) {
                var uiTextBox      = entity.getComponent('UITextBox');
                var uiStyle        = uiTextBox.getCurrentStyle();
                var cursorQuad     = uiTextBox.getCursorQuadComponent();
                var cursorRenderer = cursorQuad.getComponent('MeshRenderer');
                
                uiTextBox.addCursorTime(this.elapsed);
                if (uiTextBox.isCursorVisible()) {
                    cursorRenderer.setEnabled(true);
                } else {
                    cursorRenderer.setEnabled(false);
                }
            }

        });

        return UITextBoxController;
    }
);
