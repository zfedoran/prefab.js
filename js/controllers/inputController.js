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
                            }
                        }
                    }
                }
                
                this.testForMouseLeaveEvents();
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

            testForMouseEnterEvent: function(entity) {
                var i, currEntity, hasEntityAlreadyBeenAdded = false;
                for (i = 0; i < this.prevHitTestCache.length; i++) {
                    currEntity = this.prevHitTestCache[i];
                    if (currEntity === entity) {
                        hasEntityAlreadyBeenAdded = true;
                    }
                }

                if (!hasEntityAlreadyBeenAdded) {
                    entity.trigger('mouseenter');
                }
            },

            testGroupForMouseOverEvents: function(group, cameraComponent) {
                var entities = this.entityManager.getAllUsingGroupName(group);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('GUIElement')) {
                            this.testEntityForMouseOverEvent(entity, cameraComponent);
                        }
                    }
                }
            },

            testEntityForMouseOverEvent: function(entity, cameraComponent) {
                var guiElement = entity.getComponent('GUIElement');
                var boundingRect = guiElement.boundingBox;
            
                var x = boundingRect.x + cameraComponent.viewRect.x;
                var y = boundingRect.y + cameraComponent.viewRect.y;

                if (this.mousePosition.x >= x 
                 && this.mousePosition.x <= x + boundingRect.width
                 && this.mousePosition.y >= y
                 && this.mousePosition.y <= y + boundingRect.height) {
                    this.currHitTestCache.push(entity);
                    this.testForMouseEnterEvent(entity);
                }
            },
        });

        return InputController;
    }
);
