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
                this.filterBy(['Transform', 'UIButton', 'BoxCollider'], function(entity) {
                    var uiButton    = entity.getComponent('UIButton');

                    if (uiButton.isDirty()) {
                        this.updateButton(entity);
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
                var uiButton    = entity.getComponent('UIButton');
                var transform   = entity.getComponent('Transform');
                var boxCollider = entity.getComponent('BoxCollider');
                var uiStyle     = uiButton.getCurrentStyle();

                // Get the UIText and Quad child entities
                var uiTextEntity, quadEntity;
                uiTextEntity = entity.getWithTag('foreground');
                quadEntity   = entity.getWithTag('background');

                // Get the UIText and Quad components
                var uiText = uiTextEntity.getComponent('UIText');
                var quad   = quadEntity.getComponent('Quad');

                // Update the child components (and set dirty)
                uiText.setText(uiButton.text);
                quad.setSprite(uiStyle.background);

                // Update the materials
                var uiTextMaterial = uiTextEntity.getComponent('MeshRenderer').material;
                var quadMaterial   = quadEntity.getComponent('MeshRenderer').material;

                uiTextMaterial.diffuse  = uiStyle.fontColor;
                quadMaterial.diffuseMap = uiStyle.background;

                // Set the uiText position to be offset by the padding
                var uiTextTransform = uiTextEntity.getComponent('Transform');
                uiTextTransform.setPosition(uiStyle.paddingLeft, -uiStyle.paddingTop, 0);

                // Update the quad once the uiText has been updated
                uiText.once('updated', function() {
                    // Set the quad to be the uiText size + padding
                    quad.setWidth(uiText.getComputedWidth() + uiStyle.paddingLeft + uiStyle.paddingRight);
                    quad.setHeight(uiText.getComputedHeight() + uiStyle.paddingTop + uiStyle.paddingBottom);
                });

                // Set the boxCollider bounding box once the quad mesh is available
                quad.once('updated', function() {
                    var meshFilter  = quadEntity.getComponent('MeshFilter');
                    var boundingBox = meshFilter.getMesh().getBoundingBox();
                    boxCollider.setBoundingBox(boundingBox);
                });

                uiButton.setDirty(false);
            }

        });

        return UIButtonController;
    }
);
