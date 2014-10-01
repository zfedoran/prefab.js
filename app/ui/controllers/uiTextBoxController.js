define([
        'lodash',
        'core/controller'
    ], 
    function(
        _,
        Controller
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

                this.filterBy(['Transform', 'UITextBox', 'BoxCollider'], function(entity) {
                    var uiTextBox = entity.getComponent('UITextBox');

                    if (uiTextBox.isDirty()) {
                        this.updateInput(entity);
                        uiTextBox.setDirty(false);
                    }

                    this.updateCursor(entity);
                }, this);
            }, 

            /**
            *   This method updates the input entity and its children.
            *
            *   @method updateInput
            *   @param {entity}
            *   @returns {undefined}
            */
            updateInput: function(entity) {
                var transform   = entity.getComponent('Transform');
                var boxCollider = entity.getComponent('BoxCollider');
                var uiTextBox   = entity.getComponent('UITextBox');
                var uiStyle     = uiTextBox.getCurrentStyle();

                // Get the UIText and Quad child entities
                var uiTextEntity, quadEntity, cursorEntity;
                uiTextEntity = entity.getWithTag('foreground');
                quadEntity   = entity.getWithTag('background');
                cursorEntity = entity.getWithTag('cursor');

                // Get the UIText and Quad components
                var foregroundText = uiTextEntity.getComponent('UIText');
                var backgroundQuad  = quadEntity.getComponent('Quad');
                var cursorQuad      = cursorEntity.getComponent('Quad');

                // Update the child components (and set dirty)
                foregroundText.setText(uiTextBox.text);
                backgroundQuad.setSprite(uiStyle.background);

                // Update the materials
                var uiTextMaterial = uiTextEntity.getComponent('MeshRenderer').material;
                var quadMaterial   = quadEntity.getComponent('MeshRenderer').material;

                uiTextMaterial.diffuse  = uiStyle.fontColor;
                quadMaterial.diffuseMap = uiStyle.background;

                // Set the uiText position to be offset by the padding
                var uiTextTransform = uiTextEntity.getComponent('Transform');
                uiTextTransform.setPosition(uiStyle.paddingLeft, -uiStyle.paddingTop, 0);

                // Update the quad once the uiText has been updated
                foregroundText.once('updated', function() {
                    // Set the quad to be the uiText size + padding
                    backgroundQuad.setWidth(foregroundText.getComputedWidth() + uiStyle.paddingLeft + uiStyle.paddingRight);
                    backgroundQuad.setHeight(foregroundText.getComputedHeight() + uiStyle.paddingTop + uiStyle.paddingBottom);

                    // Update the cursor
                    if (uiTextBox.hasFocusState()) {
                        // Update cursor color
                        var cursorMaterial     = cursorEntity.getComponent('MeshRenderer').material;
                        cursorMaterial.diffuse = uiStyle.fontColor;

                        // Update cursor position
                        var cursorTranform = cursorEntity.getComponent('Transform');
                        var dx = foregroundText.getComputedWidth() + uiStyle.paddingLeft;
                        var dy = foregroundText.getComputedHeight() / 2;
                        cursorTranform.setPosition(dx, -dy, 0);
                    }
                });

                // Set the boxCollider bounding box once the quad mesh is available
                backgroundQuad.once('updated', function() {
                    var meshFilter  = quadEntity.getComponent('MeshFilter');
                    var boundingBox = meshFilter.getMesh().getBoundingBox();
                    boxCollider.setBoundingBox(boundingBox);
                });
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
                var cursorEntity   = entity.getWithTag('cursor');
                var cursorRenderer = cursorEntity.getComponent('MeshRenderer');
                
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
