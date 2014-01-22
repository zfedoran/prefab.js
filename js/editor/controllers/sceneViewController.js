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
        'editor/components/orbit'
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
        SceneView,
        Orbit
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

                        var sceneView       = entity.getComponent('SceneView');

                        if (!sceneView.isInitialized) {
                            this.initSceneView(entity);
                        }

                        if (sceneView.isDirty()) {
                            this.updateSceneView(entity);
                        }
                    }
                }
            },

            updateSceneView: function(entity) {
                var sceneView = entity.getComponent('SceneView');
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
                var view      = entity.getComponent('View');

                var text = entity.uuid + ' Scene';
                var guiText = new GUITextEntity(new Rectangle(0, 0, 100, 100), text);
                this.entityManager.addEntity(guiText);
                this.entityManager.addEntityToGroup(guiText, view.groupNameGUI);

                sceneView.viewLabel = guiText;
            },

            initGrid: function(entity) {
                var sceneView = entity.getComponent('SceneView');
                var view      = entity.getComponent('View');

                var gridEntity = new GridEntity(100, 100, 100);
                this.entityManager.addEntity(gridEntity);
                this.entityManager.addEntityToGroup(gridEntity, view.groupNameCamera);

                var gridComponent = gridEntity.getComponent('Grid');

                if (sceneView.direction === SceneView.VIEW_DIRECTION_TOP) {
                    gridComponent.hasXYPlane = false;
                    gridComponent.hasYZPlane = false;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_BOTTOM) {
                    gridComponent.hasXYPlane = false;
                    gridComponent.hasYZPlane = false;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_LEFT) {
                    gridComponent.hasXYPlane = false;
                    gridComponent.hasXZPlane = false;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_RIGHT) {
                    gridComponent.hasXYPlane = false;
                    gridComponent.hasXZPlane = false;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_FRONT) {
                    gridComponent.hasXZPlane = false;
                    gridComponent.hasYZPlane = false;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_BACK) {
                    gridComponent.hasXZPlane = false;
                    gridComponent.hasYZPlane = false;
                }

                gridComponent.setDirty(true);

                sceneView.gridEntity = gridEntity;
            },

            initCamera: function(entity) {
                var view         = entity.getComponent('View');
                var sceneView    = entity.getComponent('SceneView');
                var cameraEntity = view.cameraEntity;

                cameraEntity.addComponent(new Orbit());

                var cameraComponent = cameraEntity.getComponent('Camera');
                cameraComponent.addRenderGroup(sceneView.groupNameScene);

                if (sceneView.projection === SceneView.VIEW_PROJECTION_ORTHO) {
                    cameraComponent.ortho = true;
                } else {
                    cameraComponent.ortho = false;
                    cameraComponent.fov = 75;
                    cameraComponent.far = 500;
                    cameraComponent.near = 0.1;
                }
                cameraComponent.target = new Vector3(0,0,0);
                cameraComponent.setDirty(true);

                var cameraTransform = cameraEntity.getComponent('Transform');
                if (sceneView.direction === SceneView.VIEW_DIRECTION_TOP) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = 10;
                    cameraTransform.localPosition.z = 0;
                    cameraComponent.up = Vector3.LEFT;
                } else if (sceneView.direction === SceneView.VIEW_DIRECTION_BOTTOM) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = -10;
                    cameraTransform.localPosition.z = 0;
                    cameraComponent.up = Vector3.LEFT;
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
