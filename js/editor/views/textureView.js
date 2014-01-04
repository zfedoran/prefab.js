define([
        'lodash',
        'math/rectangle',
        'math/vector3',
        'math/vector2',
        'core/view',
        'entities/cameraEntity',
        'entities/guiLayerEntity',
        'entities/guiTextEntity',
        'entities/gridEntity',
        'editor/entities/unwrapEntity',
        'editor/controllers/unwrapController'
    ],
    function(
        _,
        Rectangle,
        Vector3,
        Vector2,
        View,
        CameraEntity,
        GUILayerEntity,
        GUITextEntity,
        GridEntity,
        UnwrapEntity,
        UnwrapController
    ) {
        'use strict';
    
        var TextureView = function(context, viewRect) {
            View.apply(this, arguments);

            this.groupNameGUI = this.getGroupInstanceName('ViewGUILayer');
            this.groupName2D  = this.getGroupInstanceName('View2DLayer');

            this.initCamera();
            this.initGrid();
            this.initGUI();
            this.init();
        };

        TextureView.prototype = _.create(View.prototype, {
            constructor: TextureView,

            init: function() {
                this.guiText = new GUITextEntity(new Rectangle(0, 0, 1000, 100), this.uuid + ' Texture');
                this.entityManager.addEntity(this.guiText);
                this.entityManager.addEntityToGroup(this.guiText, this.groupNameGUI);

                this.unwrapController = new UnwrapController(this.context);

                this.currentBlock = this.context.getOneSelectedBlock();
                if (typeof this.currentBlock !== 'undefined') {
                    this.unwrapEntity = new UnwrapEntity(this.currentBlock);
                    this.entityManager.addEntity(this.unwrapEntity);
                    this.entityManager.addEntityToGroup(this.unwrapEntity, this.groupName2D);
                }
            },

            initGUI: function() {
                this.guiLayer = new GUILayerEntity(this.viewRect);
                this.guiLayer.getComponent('Camera').addRenderGroup(this.groupNameGUI);
                this.entityManager.addEntity(this.guiLayer);
            },

            initCamera: function() {
                this.camera = new CameraEntity(this.viewRect, 0, 100);
                this.entityManager.addEntity(this.camera);

                var cameraComponent = this.camera.getComponent('Camera');
                cameraComponent.addRenderGroup(this.groupName2D);
            },

            initGrid: function() {
                this.grid = new GridEntity(100, 100, 100);
                this.entityManager.addEntity(this.grid);
                this.entityManager.addEntityToGroup(this.grid, this.groupName2D);

                var gridComponent = this.grid.getComponent('Grid');
                gridComponent.hasXZPlane = false;
                gridComponent.hasYZPlane = false;
                gridComponent.setDirty(true);
            },

            update: function(elapsed) {
                this.unwrapController.update();
            },

            setSize: function(width, height) {
            }
        });

        return TextureView;
    }
);
