define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller
    ) {
        'use strict';

        var MouseOverController = function(context) {
            Controller.call(this, context, ['View', 'InputMouse']);
        };

        MouseOverController.prototype = _.create(Controller.prototype, {
            constructor: MouseOverController,

            update: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);

                // Remove all entities form the mouse over groups
                this.entityManager.removeAllEntitiesFromGroup(MouseOverController.GROUP_VIEWS);
                this.entityManager.removeAllEntitiesFromGroup(MouseOverController.GROUP_GUI_ELEMENTS);

                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        var inputMouse = entity.getComponent('InputMouse');
                        var guiCamera  = this.context.guiLayerEntity.getComponent('Camera');

                        if (guiCamera.isEnabled() && guiCamera.renderGroups.length > 0) {
                            var isMouseOnTopOfView = this.testEntity(entity, inputMouse, guiCamera);
                            if (isMouseOnTopOfView) {
                                this.addToMouseOverGroup(entity, 
                                    MouseOverController.GROUP_VIEWS);

                                var i, renderGroupList = guiCamera.renderGroups;
                                for (i = 0; i < renderGroupList.length; i++) {
                                    this.testRenderGroup(renderGroupList[i], inputMouse, guiCamera);
                                }
                            }
                        }
                    }
                }
            },

            addToMouseOverGroup: function(entity, groupName) {
                this.entityManager.addEntityToGroup(entity, groupName);
            },

            testRenderGroup: function(renderGroup, inputMouse, guiCamera) {
                var entities = this.entityManager.getAllUsingGroupName(renderGroup);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];
                        if (entity.hasComponent('GUIElement')) {
                            var isMouseOnTopOfEntity = this.testEntity(entity, inputMouse, guiCamera);
                            if (isMouseOnTopOfEntity) {
                                this.addToMouseOverGroup(entity, 
                                    MouseOverController.GROUP_GUI_ELEMENTS);
                            }
                        }
                    }
                }
            },

            testEntity: function(entity, inputMouse, guiCamera) {
                var guiElement = entity.getComponent('GUIElement');
            
                var x = guiElement.boundingRect.x;
                var y = guiElement.boundingRect.y;

                return (inputMouse.currState.mousePosition.x >= x 
                     && inputMouse.currState.mousePosition.x < x + guiElement.boundingRect.width
                     && inputMouse.currState.mousePosition.y >= y
                     && inputMouse.currState.mousePosition.y < y + guiElement.boundingRect.height);
            },
        });

        MouseOverController.GROUP_VIEWS        = 'MouseOverView';
        MouseOverController.GROUP_GUI_ELEMENTS = 'MouseOverGUIElement';

        return MouseOverController;
    }
);
