define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'math/matrix4',
        'core/controller',
        'core/buttonState',
        'controllers/mouseOverController',
        'editor/components/textureView',
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
        TextureView,
        InputMouse
    ) {
        'use strict';

        var TextureViewCameraController = function(context) {
            Controller.call(this, context, ['View', 'TextureView', 'InputMouse']);
        };

        TextureViewCameraController.prototype = _.extend(Object.create(Controller.prototype), {
            constructor: TextureViewCameraController,

            updateMouseOverViews: function() {
                var entities = this.entityManager.getAllUsingGroupName(MouseOverController.GROUP_VIEWS);

                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('TextureView')) {
                            var textureView  = entity.getComponent('TextureView');
                            var inputMouse = entity.getComponent('InputMouse');

                            if (inputMouse.hasButtonDownEvent(InputMouse.BUTTON_LEFT)) {
                                textureView.state = TextureView.STATE_PAN;
                            } else if (inputMouse.hasButtonDownEvent(InputMouse.BUTTON_RIGHT)) {
                                //textureView.state = TextureView.STATE_ROTATE;
                                console.log('');
                            } else if (inputMouse.hasScrollEvent()) {
                                textureView.state = TextureView.STATE_ZOOM;
                            }
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

                        var textureView  = entity.getComponent('TextureView');
                        var inputMouse = entity.getComponent('InputMouse');

                        // Handle state logic
                        if (textureView.state === TextureView.STATE_PAN) {
                            //this.rotateSceneView(entity);
                            console.log('');
                        } else if (textureView.state === TextureView.STATE_ZOOM) {
                            this.zoomSceneView(entity);
                      //} else if (textureView.state === TextureView.STATE_ROTATE) {
                      //    this.panSceneView(entity);
                        } 

                        // Restore default state if the mouse has been released
                        var areAllButtonsReleased = 
                            (inputMouse.currState.buttonLeft === ButtonState.BUTTON_UP) &&
                            (inputMouse.currState.buttonRight === ButtonState.BUTTON_UP) &&
                            (inputMouse.currState.buttonMiddle === ButtonState.BUTTON_UP);

                        if (areAllButtonsReleased) {
                            textureView.state = TextureView.STATE_NONE;
                        }
                    }
                }
            },

            zoomSceneView: function(entity) {
                var view       = entity.getComponent('View');
                var inputMouse = entity.getComponent('InputMouse');

                var camera     = view.cameraEntity.getComponent('Camera');
                var center     = camera.getTargetPosition();
                var transform  = view.cameraEntity.getComponent('Transform');

                var dy;
                dy = -inputMouse.currState.mouseWheel.y;
                dy *= 0.005;

                // vector = cameraPosition - center;
                Vector3.subtract(transform.getPosition(), center, /*out*/ vector);
                vector.normalize();
                Vector3.multiplyScalar(vector, dy, /*out*/ vector);

                //TODO: the set the local position correctly
                // cameraPosition = center + vector;
                Vector3.add(transform.localPosition, vector, /*out*/ transform.localPosition);
                transform.setDirty(true);
            },

        });

        // Cahce vector class so that it does not need to be re-created each function call
        var vector = new Vector3();
        var matrix = new Matrix4();

        return TextureViewCameraController;
    }
);
