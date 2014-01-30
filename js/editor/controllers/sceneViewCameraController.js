define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'math/matrix4',
        'core/controller',
        'core/buttonState',
        'controllers/mouseOverController',
        'editor/components/sceneView',
        'components/inputMouse'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Matrix4,
        Controller,
        ButtonState,
        MouseOverController,
        SceneView,
        InputMouse
    ) {
        'use strict';

        var SceneViewCameraController = function(context) {
            Controller.call(this, context, ['View', 'SceneView', 'InputMouse']);
        };

        SceneViewCameraController.prototype = _.extend(Object.create(Controller.prototype), {
            constructor: SceneViewCameraController,

            updateMouseOverViews: function() {
                var entities = this.entityManager.getAllUsingGroupName(MouseOverController.GROUP_VIEWS);

                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        var sceneView  = entity.getComponent('SceneView');
                        var inputMouse = entity.getComponent('InputMouse');

                        if (inputMouse.hasButtonDownEvent(InputMouse.BUTTON_LEFT)) {
                            sceneView.state = SceneView.STATE_ROTATE;
                        } else if (inputMouse.hasButtonDownEvent(InputMouse.BUTTON_RIGHT)) {
                            sceneView.state = SceneView.STATE_PAN;
                        } else if (inputMouse.hasButtonDownEvent(InputMouse.BUTTON_MIDDLE)) {
                            sceneView.state = SceneView.STATE_ZOOM;
                        }
                    }
                }
            },

            update: function() {
                this.updateMouseOverViews();

                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        var sceneView  = entity.getComponent('SceneView');
                        var inputMouse = entity.getComponent('InputMouse');

                        // Restore default state if the mouse has been released
                        var areAllButtonsReleased = 
                            (inputMouse.currState.buttonLeft === ButtonState.BUTTON_UP) &&
                            (inputMouse.currState.buttonRight === ButtonState.BUTTON_UP) &&
                            (inputMouse.currState.buttonMiddle === ButtonState.BUTTON_UP);

                        if (areAllButtonsReleased) {
                            sceneView.state = SceneView.STATE_NONE;
                        }

                        // Handle state logic
                        if (sceneView.state === SceneView.STATE_ROTATE) {
                            this.rotateSceneView(entity);
                      //} else if (this.state === SceneView.STATE_ZOOM) {
                      //    this.zoomSceneView(entity);
                      //} else if (this.state === SceneView.STATE_PAN) {
                      //    this.panSceneView(entity);
                        } 
                    }
                }
            },

            getActiveSceneEntity: function() {
                return this.context.getOneSelectedBlock();
            },

            rotateSceneView: function(entity) {
                var view         = entity.getComponent('View');
                var inputMouse   = entity.getComponent('InputMouse');

                var camera       = view.cameraEntity.getComponent('Camera');
                var center       = camera.getTargetPosition();
                var transform    = view.cameraEntity.getComponent('Transform');

                var dx, dy;
                dx = inputMouse.prevState.mousePosition.x - inputMouse.currState.mousePosition.x;
                dy = inputMouse.prevState.mousePosition.y - inputMouse.currState.mousePosition.y;

                dx *= 0.005;
                dy *= 0.005;

                // vector = cameraPosition - center;
                Vector3.subtract(transform.getPosition(), center, /*out*/ vector);

                var theta = Math.atan2( vector.x, vector.z );
                var phi   = Math.atan2( Math.sqrt( vector.x * vector.x + vector.z * vector.z ), vector.y );

                theta += dx;
                phi   += dy;

                var EPS = 0.000001;
                phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

                var radius = vector.length();

                vector.x = radius * Math.sin( phi ) * Math.sin( theta );
                vector.y = radius * Math.cos( phi );
                vector.z = radius * Math.sin( phi ) * Math.cos( theta );

                //TODO: the set the local position correctly
                // cameraPosition = center + vector;
                Vector3.add(center, vector, /*out*/ transform.localPosition);
                transform.setDirty(true);
            },

        });

        // Cahce vector class so that it does not need to be re-created each function call
        var vector    = new Vector3();
        var matrix    = new Matrix4();

        return SceneViewCameraController;
    }
);
