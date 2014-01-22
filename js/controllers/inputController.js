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

        var InputController = function(context) {
            Controller.call(this, context, ['Transform', 'Camera']);

            this.currHitTestCache = [];
            this.prevHitTestCache = [];

            this.mousePosition = new Vector2();
        };

        InputController.prototype = _.extend(Object.create(Controller.prototype), {
            constructor: InputController,

            onMouseLeave: function() {
                // Swap and clear the hit test cache list
                var tmp = this.prevHitTestCache;
                this.prevHitTestCache = this.currHitTestCache;
                this.currHitTestCache = tmp;
                this.currHitTestCache.length = 0;

                this.testForMouseLeaveEvents();
            },

            onMouseClick: function() {
                var i, entity;
                for (i = 0; i < this.currHitTestCache.length; i++) {
                    entity = this.currHitTestCache[i];
                    entity.trigger('click');
                }
            },

            onMouseMove: function(pageX, pageY) {
                this.mousePosition.x = pageX;
                this.mousePosition.y = pageY;

                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);

                // Swap and clear the hit test cache list
                var tmp = this.prevHitTestCache;
                this.prevHitTestCache = this.currHitTestCache;
                this.currHitTestCache = tmp;
                this.currHitTestCache.length = 0;

                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];
                        if (entity.hasComponent('Camera')) {
                            var camera = entity.getComponent('Camera');
                            if (camera.isEnabled() && camera.renderGroups.length > 0) {
                                var i, group;
                                for (i = 0; i < camera.renderGroups.length; i++) {
                                    group = camera.renderGroups[i];
                                    this.testGroupForMouseOverEvents(group, camera);
                                }

                                this.testViewportForMouseOverEvents(entity, camera);
                            }
                        }
                    }
                }
                
                this.testForMouseLeaveEvents();
                this.testForMouseEnterEvents();
            },

            testForMouseLeaveEvents: function() {
                var i, j, prevEntity, currEntity, isEntityInsideBothCacheLists;
                for (i = 0; i < this.prevHitTestCache.length; i++) {
                    prevEntity = this.prevHitTestCache[i];
                    isEntityInsideBothCacheLists = false;

                    for (j = 0; j < this.currHitTestCache.length; j++) {
                        currEntity = this.currHitTestCache[j];
                        if (prevEntity === currEntity) {
                            isEntityInsideBothCacheLists = true;
                            break;
                        }
                    }

                    if (!isEntityInsideBothCacheLists) {
                        prevEntity.trigger('mouseleave');
                    }
                }
            },

            testForMouseEnterEvents: function() {
                var i, j, prevEntity, currEntity, isEntityInsideBothCacheLists;
                for (i = 0; i < this.currHitTestCache.length; i++) {
                    currEntity = this.currHitTestCache[i];
                    isEntityInsideBothCacheLists = false;

                    for (j = 0; j < this.prevHitTestCache.length; j++) {
                        prevEntity = this.prevHitTestCache[j];
                        if (prevEntity === currEntity) {
                            isEntityInsideBothCacheLists = true;
                            break;
                        }
                    }

                    if (!isEntityInsideBothCacheLists) {
                        currEntity.trigger('mouseenter');
                    }
                }
            },

            testViewportForMouseOverEvents: function(entity, cameraComponent) {
                if (cameraComponent.viewRect.contains(this.mousePosition)) {
                    this.currHitTestCache.push(entity);
                }
            },

            testGroupForMouseOverEvents: function(group, cameraComponent) {
                var entities = this.entityManager.getAllUsingGroupName(group);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('GUIElement')) {
                            this.testEntityForMouseOverEvents(entity, cameraComponent);
                        }
                    }
                }
            },

            testEntityForMouseOverEvents: function(entity, cameraComponent) {
                var guiElement = entity.getComponent('GUIElement');
                var boundingRect = guiElement.boundingRect;
            
                var x = boundingRect.x + cameraComponent.viewRect.x;
                var y = boundingRect.y + cameraComponent.viewRect.y;

                if (this.mousePosition.x >= x 
                 && this.mousePosition.x <= x + boundingRect.width
                 && this.mousePosition.y >= y
                 && this.mousePosition.y <= y + boundingRect.height) {
                    this.currHitTestCache.push(entity);
                }
            },
        });

        return InputController;
    }
);
