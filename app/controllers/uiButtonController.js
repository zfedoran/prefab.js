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
                    var uiButton    = entity.getComponent('UIButton');
                    var boxCollider = entity.getComponent('BoxCollider');

                    if (uiButton.isDirty()) {
                        // Get the Label and Quad child entities
                        var labelEntity, quadEntity;
                        entity.filterChildrenBy(['Label'], function(entity){ labelEntity = entity; }, this);
                        entity.filterChildrenBy(['Quad'], function(entity){ quadEntity = entity; }, this);

                        // Get the Label and Quad components
                        var label = labelEntity.getComponent('Label');
                        var quad  = quadEntity.getComponent('Quad');

                        // Update the child components (and set dirty)
                        label.setText(uiButton.text);
                        quad.setSprite(uiButton.getCurrentSprite());

                        // Update the quad once the label has been updated
                        label.once('updated', function() {
                            // TODO: Clean this up
                            // - size the quad using the label + padding
                            
                            var boundingBox = labelEntity.getComponent('MeshFilter').getMesh().getBoundingBox();
                            quad.width  = Math.abs(boundingBox.min.x - boundingBox.max.x) + uiButton.uiElementStyle.padding.y*2;
                            quad.height = Math.abs(boundingBox.min.y - boundingBox.max.y) + uiButton.uiElementStyle.padding.x*2;
                            quad.setDirty(true);
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
