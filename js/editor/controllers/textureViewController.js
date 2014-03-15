define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'math/rectangle',
        'core/controller',
        'entities/guiTextEntity',
        'entities/cameraEntity',
        'editor/entities/gridEntity',
        'editor/entities/unwrapEntity'
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
        UnwrapEntity
    ) {
        'use strict';

        var TextureViewController = function(context) {
            Controller.call(this, context, ['GUIElement', 'View', 'TextureView']);
        };

        TextureViewController.prototype = _.create(Controller.prototype, {
            constructor: TextureViewController,

            update: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);
                var o, entity, guiElement;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        var textureView = entity.getComponent('TextureView');

                        if (!textureView.isInitialized) {
                            this.initTextureView(entity);
                        }

                        if (textureView.isDirty()) {
                            this.updateTextureView(entity);
                        }
                    }
                }
            },

            updateTextureView: function(entity) {
                var textureView = entity.getComponent('TextureView');
            },

            initTextureView: function(entity) {
                var textureView = entity.getComponent('TextureView');

                this.initCamera(entity);
                this.initCurrentSelection(entity);
                this.initGrid(entity);
                this.initViewLabel(entity);

                textureView.isInitialized = true;
            },

            initViewLabel: function(entity) {
                var textureView = entity.getComponent('TextureView');

                var text = entity.uuid + ' Texture';
                var guiText = new GUITextEntity(new Rectangle(0, 0, 100, 100), text);
                this.context.addGUIElement(guiText);

                textureView.viewLabel = guiText;
            },

            initCurrentSelection: function(entity) {
                var textureView = entity.getComponent('TextureView');

                textureView.currentBlock = this.context.getOneSelectedBlock();
                if (typeof textureView.currentBlock !== 'undefined') {
                    textureView.unwrapEntity = new UnwrapEntity(textureView.currentBlock);
                    this.entityManager.addEntity(textureView.unwrapEntity);
                    this.entityManager.addEntityToGroup(textureView.unwrapEntity, textureView.groupNameTextureView);
                }
            },

            initGrid: function(entity) {
                var textureView = entity.getComponent('TextureView');

                var gridEntity = new GridEntity(100, 100, 100);
                this.entityManager.addEntity(gridEntity);
                this.entityManager.addEntityToGroup(gridEntity, textureView.groupNameTextureView);

                var gridComponent = gridEntity.getComponent('Grid');
                gridComponent.hasXZPlane = false;
                gridComponent.hasYZPlane = false;
                gridComponent.setDirty(true);

                textureView.gridEntity = gridEntity;
            },

            initCamera: function(entity) {
                var guiElement = entity.getComponent('GUIElement');
                var textureView  = entity.getComponent('TextureView');

                // Create camera entity
                var cameraEntity = new CameraEntity(guiElement.boundingRect, 0, 100);
                this.entityManager.addEntity(cameraEntity);

                var cameraComponent = cameraEntity.getComponent('Camera');
                cameraComponent.addRenderGroup(textureView.groupNameTextureView);

                textureView.cameraEntity = cameraEntity;

                var camera = cameraEntity.getComponent('Camera');
                camera.ortho = false;
                camera.fov   = 75;
                camera.far   = 500;
                camera.near  = 0.1;
                camera.target = new Vector3(0,0,0);
                camera.setDirty(true);

                var transform = cameraEntity.getComponent('Transform');
                transform.localPosition.x = 0;
                transform.localPosition.y = 0;
                transform.localPosition.z = -textureView.zoom;
                transform.setDirty(true);
            },

        });

        return TextureViewController;
    }
);
