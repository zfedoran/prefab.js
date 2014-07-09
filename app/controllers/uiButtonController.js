define([
        'lodash',
        'core/controller'
    ], 
    function(
        _,
        Controller
    ) {
        'use strict';

        var UIButtonController = function(context) {
            Controller.call(this, context);
        };

        UIButtonController.prototype = _.create(Controller.prototype, {
            constructor: UIButtonController,

            /**
            *   Update all entities which contain the Collider and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'UIButton', 'BoxCollider'], function(entity) {
                    var transform   = entity.getComponent('Transform');
                    var boxCollider = entity.getComponent('BoxCollider');
                    var uiButton    = entity.getComponent('UIButton');
                    var uiStyle     = uiButton.getCurrentStyle();

                    if (uiButton.isDirty()) {
                        // Get the Label and Quad child entities
                        var labelEntity, quadEntity;
                        labelEntity = entity.getWithTag('foreground');
                        quadEntity  = entity.getWithTag('background');

                        // Get the Label and Quad components
                        var label = labelEntity.getComponent('Label');
                        var quad  = quadEntity.getComponent('Quad');

                        // Update the child components (and set dirty)
                        label.setText(uiButton.text);
                        quad.setSprite(uiButton.getCurrentBackground());

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

                        uiButton.setDirty(false);
                    }
                }, this);
            }

        });

        return UIButtonController;
    }
);
