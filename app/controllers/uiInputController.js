define([
        'lodash',
        'core/controller'
    ], 
    function(
        _,
        Controller
    ) {
        'use strict';

        var UIInputController = function(context) {
            Controller.call(this, context);
        };

        UIInputController.prototype = _.create(Controller.prototype, {
            constructor: UIInputController,

            /**
            *   Update all entities which contain the Collider and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function(elapsed) {
                this.elapsed = elapsed;

                this.filterBy(['Transform', 'UIInput', 'BoxCollider'], function(entity) {
                    var uiInput = entity.getComponent('UIInput');

                    if (uiInput.isDirty()) {
                        this.updateInput(entity);
                        uiInput.setDirty(false);
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
                var uiInput     = entity.getComponent('UIInput');
                var uiStyle     = uiInput.getCurrentStyle();

                // Get the Label and Quad child entities
                var labelEntity, quadEntity;
                labelEntity = entity.getWithTag('foreground');
                quadEntity  = entity.getWithTag('background');

                // Get the Label and Quad components
                var label = labelEntity.getComponent('Label');
                var quad  = quadEntity.getComponent('Quad');

                // Update the child components (and set dirty)
                label.setText(uiInput.text);
                quad.setSprite(uiInput.getCurrentBackground());

                // Update the materials
                var labelMaterial = labelEntity.getComponent('MeshRenderer').material;
                var quadMaterial  = quadEntity.getComponent('MeshRenderer').material;

                labelMaterial.diffuse   = uiStyle.fontColor;
                quadMaterial.diffuseMap = uiStyle.background;

                // Set the label position to be offset by the padding
                var labelTransform = labelEntity.getComponent('Transform');
                labelTransform.setPosition(uiStyle.paddingLeft, -uiStyle.paddingTop, 0);

                // Update the quad once the label has been updated
                label.once('updated', function() {
                    // Set the quad to be the label size + padding
                    quad.setWidth(label.getComputedWidth() + uiStyle.paddingLeft + uiStyle.paddingRight);
                    quad.setHeight(label.getComputedHeight() + uiStyle.paddingTop + uiStyle.paddingBottom);
                });

                // Set the boxCollider bounding box once the quad mesh is available
                quad.once('updated', function() {
                    var meshFilter  = quadEntity.getComponent('MeshFilter');
                    var boundingBox = meshFilter.getMesh().getBoundingBox();
                    boxCollider.setBoundingBox(boundingBox);
                });
            },

            /**
            *   This method controls the UIInput blinking cursor.
            *
            *   @method updateCursor
            *   @param {entity}
            *   @returns {undefined}
            */
            updateCursor: function(entity) {
                var uiInput        = entity.getComponent('UIInput');
                var uiStyle        = uiInput.getCurrentStyle();
                var cursorEntity   = entity.getWithTag('cursor');
                var cursorRenderer = cursorEntity.getComponent('MeshRenderer');
                
                uiInput.addCursorTime(this.elapsed);
                if (uiInput.isCursorVisible()) {
                    cursorRenderer.setEnabled(true);
                } else {
                    cursorRenderer.setEnabled(false);
                }
            }

        });

        return UIInputController;
    }
);
