define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'entities/cameraEntity',
        'entities/guiLayerEntity'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller,
        CameraEntity,
        GUILayerEntity
    ) {
        'use strict';

        var ViewController = function(context) {
            Controller.call(this, context, ['GUIElement', 'View']);
        };

        ViewController.prototype = _.extend(Object.create(Controller.prototype), {
            constructor: ViewController,

            update: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        var view       = entity.getComponent('View');
                        var guiElement = entity.getComponent('GUIElement');

                        if (!view.isInitialized) {
                            this.initView(entity);
                        }

                        if (view.isDirty() || guiElement.isDirty()) {
                            this.updateView(entity);
                        }
                    }
                }
            },

            updateView: function(entity) {
                var view       = entity.getComponent('View');
                var guiElement = entity.getComponent('GUIElement');

                this.updateCameraViewRect(view.cameraEntity, guiElement.boundingRect);
                this.updateCameraViewRect(view.guiLayerEntity, guiElement.boundingRect);

                view.setDirty(false);
                guiElement.setDirty(false);
            },

            updateCameraViewRect: function(entity, viewRect) {
                var camera = entity.getComponent('Camera');
                camera.width  = viewRect.width;
                camera.height = viewRect.height;
                camera.setDirty(true);
            },

            initView: function(entity) {
                var view = entity.getComponent('View');

                this.initCamera(entity);
                this.initGUILayer(entity);

                view.isInitialized = true;
            },

            initCamera: function(entity) {
                var guiElement = entity.getComponent('GUIElement');
                var view       = entity.getComponent('View');

                var cameraEntity = new CameraEntity(guiElement.boundingRect, 0, 100);
                this.entityManager.addEntity(cameraEntity);

                var cameraComponent = cameraEntity.getComponent('Camera');
                cameraComponent.addRenderGroup(view.groupNameCamera);

                view.cameraEntity = cameraEntity;
                if (!window.cameraList) {
                    window.cameraList = [];
                }
                window.cameraList.push(cameraComponent);
            },

            initGUILayer: function(entity) {
                var guiElement = entity.getComponent('GUIElement');
                var view       = entity.getComponent('View');

                var guiLayerEntity = new GUILayerEntity(guiElement.boundingRect);
                this.entityManager.addEntity(guiLayerEntity);

                var cameraComponent = guiLayerEntity.getComponent('Camera');
                cameraComponent.addRenderGroup(view.groupNameGUI);

                view.guiLayerEntity = guiLayerEntity;
            },

        });

        return ViewController;
    }
);
