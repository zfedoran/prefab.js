define([
        'lodash',
        'math/rectangle',
        'math/vector3',
        'core/view',
        'entities/cameraEntity',
        'entities/guiLayerEntity',
        'entities/guiTextEntity',
        'entities/gridEntity'
    ],
    function(
        _,
        Rectangle,
        Vector3,
        View,
        CameraEntity,
        GUILayerEntity,
        GUITextEntity,
        GridEntity
    ) {
        'use strict';
    
        var SceneView = function(context, viewRect, viewDirection, viewProjection) {
            View.apply(this, arguments);

            this.groupNameGUI = this.getGroupInstanceName('ViewGUILayer');
            this.groupName3D  = this.getGroupInstanceName('View3DLayer');
            this.groupNameScene = 'Scene';

            this.guiLayer = new GUILayerEntity(viewRect);
            this.guiLayer.getComponent('Camera').addRenderGroup(this.groupNameGUI);
            this.entityManager.addEntity(this.guiLayer);

            this.camera = new CameraEntity(viewRect, 0.1, 500, 75);
            this.entityManager.addEntity(this.camera);

            this.viewDirection = viewDirection;
            this.viewProjection = viewProjection;

            this.initCamera();
            this.initGrid();
            this.init();
        };

        SceneView.prototype = _.create(View.prototype, {
            constructor: SceneView,

            init: function() {
                this.guiText = new GUITextEntity(new Rectangle(0, 0, 1000, 100), this.uuid + ' ' + this.viewDirection);
                this.entityManager.addEntity(this.guiText);
                this.entityManager.addEntityToGroup(this.guiText, this.groupNameGUI);
            },

            initCamera: function() {
                var cameraComponent = this.camera.getComponent('Camera');
                cameraComponent.addRenderGroup(this.groupNameScene);
                cameraComponent.addRenderGroup(this.groupName3D);

                if (this.viewProjection === SceneView.VIEW_PROJECTION_ORTHO) {
                    cameraComponent.ortho = true;
                }
                cameraComponent.target = new Vector3(0,0,0);
                cameraComponent.setDirty(true);

                var cameraTransform = this.camera.getComponent('Transform');
                if (this.viewDirection === SceneView.VIEW_DIRECTION_TOP) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = 10;
                    cameraTransform.localPosition.z = 0;
                    cameraComponent.up = Vector3.LEFT;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_BOTTOM) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = -10;
                    cameraTransform.localPosition.z = 0;
                    cameraComponent.up = Vector3.LEFT;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_LEFT) {
                    cameraTransform.localPosition.x = 10;
                    cameraTransform.localPosition.y = 0;
                    cameraTransform.localPosition.z = 0;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_RIGHT) {
                    cameraTransform.localPosition.x = -10;
                    cameraTransform.localPosition.y = 0;
                    cameraTransform.localPosition.z = 0;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_FRONT) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = 0;
                    cameraTransform.localPosition.z = 10;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_BACK) {
                    cameraTransform.localPosition.x = 0;
                    cameraTransform.localPosition.y = 0;
                    cameraTransform.localPosition.z = -10;
                }
                cameraTransform.setDirty(true);
            },

            initGrid: function() {
                this.grid = new GridEntity(100, 100, 100);
                this.entityManager.addEntity(this.grid);
                this.entityManager.addEntityToGroup(this.grid, this.groupName3D);

                var gridComponent = this.grid.getComponent('Grid');
                if (this.viewDirection === SceneView.VIEW_DIRECTION_TOP) {
                    gridComponent.hasXYPlane = false;
                    gridComponent.hasYZPlane = false;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_BOTTOM) {
                    gridComponent.hasXYPlane = false;
                    gridComponent.hasYZPlane = false;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_LEFT) {
                    gridComponent.hasXYPlane = false;
                    gridComponent.hasXZPlane = false;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_RIGHT) {
                    gridComponent.hasXYPlane = false;
                    gridComponent.hasXZPlane = false;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_FRONT) {
                    gridComponent.hasXZPlane = false;
                    gridComponent.hasYZPlane = false;
                } else if (this.viewDirection === SceneView.VIEW_DIRECTION_BACK) {
                    gridComponent.hasXZPlane = false;
                    gridComponent.hasYZPlane = false;
                }
                gridComponent.setDirty(true);
            },

            update: function(elapsed) {
                var transform = this.camera.getComponent('Transform');
                transform.localPosition.x = Math.sin(this.context.time * 0.001) * 5;
                transform.localPosition.y = Math.sin(this.context.time * 0.0001) * 5;
                transform.localPosition.z = Math.cos(this.context.time * 0.001) * 5;
                transform.setDirty(true);

                var camera = this.camera.getComponent('Camera');
                camera.target = new Vector3(0,0,0);
                camera.setDirty(true);
            },

            setSize: function(width, height) {
                this.viewRect.width  = width;
                this.viewRect.height = height;

                var cameraComponent;
                cameraComponent = this.camera.getComponent('Camera');
                cameraComponent.width  = width;
                cameraComponent.height = height;
                cameraComponent.setDirty(true);

                cameraComponent = this.guiLayer.getComponent('Camera');
                cameraComponent.width  = width;
                cameraComponent.height = height;
                cameraComponent.setDirty(true);
            }
        });

        SceneView.VIEW_DIRECTION_TOP       = 'top';
        SceneView.VIEW_DIRECTION_BOTTOM    = 'bottom';
        SceneView.VIEW_DIRECTION_LEFT      = 'left';
        SceneView.VIEW_DIRECTION_RIGHT     = 'right';
        SceneView.VIEW_DIRECTION_FRONT     = 'front';
        SceneView.VIEW_DIRECTION_BACK      = 'back';

        SceneView.VIEW_PROJECTION_ORTHO        = 'ortho';
        SceneView.VIEW_PROJECTION_PERSPECTIVE  = 'perspective';
    
        return SceneView;
    }
);
