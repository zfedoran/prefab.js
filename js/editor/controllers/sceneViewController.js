define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'math/rectangle',
        'core/controller',
        'entities/guiTextEntity',
        'entities/cameraEntity',
        'editor/entities/gridEntity',
        'editor/components/sceneView',
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Rectangle,
        Controller,
        GUITextEntity,
        CameraEntity,
        GridEntity,
        SceneView
    ) {
        'use strict';

        var SceneViewController = function(context) {
            Controller.call(this, context, ['GUIElement', 'View', 'SceneView']);
        };

        SceneViewController.prototype = _.extend(Object.create(Controller.prototype), {
            constructor: SceneViewController,

            update: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);
                var o, entity, guiElement;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        var sceneView = entity.getComponent('SceneView');

                        if (!sceneView.isInitialized) {
                            this.initSceneView(entity);
                        }

                        if (sceneView.isDirty()) {
                            this.updateSceneView(entity);
                        }

                        sceneView.setDirty(false);
                    }
                }
            },

            updateSceneView: function(entity) {
                this.updateGrid(entity);
                this.updateViewLabel(entity);
            },

            initSceneView: function(entity) {
                var sceneView = entity.getComponent('SceneView');

                this.initCamera(entity);
                this.initGrid(entity);
                this.initViewLabel(entity);

                sceneView.isInitialized = true;
            },

            initViewLabel: function(entity) {
                var sceneView = entity.getComponent('SceneView');

                var text    = sceneView.direction;
                var guiText = new GUITextEntity(new Rectangle(0, 0, 100, 100), text);
                this.context.addGUIElement(guiText);

                sceneView.viewLabel = guiText;
            },

            updateViewLabel: function(entity) {
                var sceneView = entity.getComponent('SceneView');
                var guiText = sceneView.viewLabel.getComponent('GUIText');

                guiText.content = sceneView.direction;
                guiText.setDirty(true);
            },

            initGrid: function(entity) {
                var sceneView = entity.getComponent('SceneView');

                var gridEntity = new GridEntity(100, 100, 100);
                this.entityManager.addEntity(gridEntity);
                this.entityManager.addEntityToGroup(gridEntity, sceneView.groupNameSceneView);

                sceneView.gridEntity = gridEntity;
            },

            updateGrid: function(entity) {
                var sceneView = entity.getComponent('SceneView');
                var gridComponent = sceneView.gridEntity.getComponent('Grid');

                gridComponent.hasXYPlane = false;
                gridComponent.hasYZPlane = false;
                gridComponent.hasXZPlane = false;

                if (sceneView.direction === SceneView.VIEW_DIRECTION_TOP) {
                    gridComponent.hasXZPlane = true;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_BOTTOM) {
                    gridComponent.hasXZPlane = true;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_LEFT) {
                    gridComponent.hasYZPlane = true;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_RIGHT) {
                    gridComponent.hasYZPlane = true;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_FRONT) {
                    gridComponent.hasXYPlane = true;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_BACK) {
                    gridComponent.hasXYPlane = true;
                } else {
                    gridComponent.hasXZPlane = true;
                }

                gridComponent.setDirty(true);
            },

            initCamera: function(entity) {
                var guiElement = entity.getComponent('GUIElement');
                var sceneView  = entity.getComponent('SceneView');

                // Create camera entity
                var cameraEntity = new CameraEntity(guiElement.boundingRect, 0, 100);
                this.entityManager.addEntity(cameraEntity);

                var cameraComponent = cameraEntity.getComponent('Camera');
                cameraComponent.addRenderGroup(sceneView.groupNameSceneView);
                cameraComponent.addRenderGroup(sceneView.groupNameScene);

                sceneView.cameraEntity = cameraEntity;

                // Init camera component
                if (sceneView.projection === SceneView.VIEW_PROJECTION_ORTHO) {
                    cameraComponent.ortho = true;
                } else {
                    cameraComponent.ortho = false;
                    cameraComponent.fov   = 75;
                    cameraComponent.far   = 500;
                    cameraComponent.near  = 0.1;
                }
                cameraComponent.target = new Vector3(0,0,0);
                cameraComponent.setDirty(true);

                var cameraTransform = cameraEntity.getComponent('Transform');
                if (sceneView.direction === SceneView.VIEW_DIRECTION_TOP) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = 10;
                    cameraTransform.localPosition.z = 0;
                //    cameraComponent.up = Vector3.LEFT;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_BOTTOM) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = -10;
                    cameraTransform.localPosition.z = 0;
                //    cameraComponent.up = Vector3.LEFT;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_LEFT) {
                    cameraTransform.localPosition.x = 10;
                    cameraTransform.localPosition.y = 0;
                    cameraTransform.localPosition.z = 0;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_RIGHT) {
                    cameraTransform.localPosition.x = -10;
                    cameraTransform.localPosition.y = 0;
                    cameraTransform.localPosition.z = 0;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_FRONT) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = 0;
                    cameraTransform.localPosition.z = 10;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_BACK) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = 0;
                    cameraTransform.localPosition.z = -10;
                }

                cameraTransform.setDirty(true);
            },

        });

        return SceneViewController;
    }
);
