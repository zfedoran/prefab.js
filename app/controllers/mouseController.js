define([
        'lodash',
        'core/controller',
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/ray',
        'graphics/meshFactory',
        'graphics/material',
        'graphics/mesh',
        'components/transform',
        'components/meshFilter',
        'components/meshRenderer'
    ],
    function(
        _,
        Controller,
        Vector2,
        Vector3,
        Vector4,
        Ray,
        MeshFactory,
        Material,
        Mesh,
        Transform,
        MeshFilter,
        MeshRenderer
    ) {
        'use strict';
    
        /**
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var MouseController = function(context) {
            Controller.call(this, context);

            this.currInfoList = [];

            this.graphicsDevice = this.context.getGraphicsDevice();
            this.mouseDevice    = this.context.getMouseDevice();

            this.initEvents();
        };

        MouseController.prototype = _.create(Controller.prototype, {
            constructor: MouseController,

            /**
            *   This function is called once per frame.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                // This controller does not do anything on update
            },

            /**
            *   This function binds the controller to the mouse device events.
            *
            *   @method initEvents
            *   @returns {undefined}
            */
            initEvents: function() {
                this.mouseDevice.on('mousemove', this.onMouseMove, this);
                this.mouseDevice.on('mousedown', this.onMouseDown, this);
                this.mouseDevice.on('mouseup', this.onMouseUp, this);
                this.mouseDevice.on('scroll', this.onMouseScroll, this);
            },

            /**
            *   This function removes the events bound to the mouse device.
            *
            *   @method removeEvents
            *   @returns {undefined}
            */
            removeEvents: function() {
                this.mouseDevice.off('mousemove', this.onMouseMove, this);
                this.mouseDevice.off('mousedown', this.onMouseDown, this);
                this.mouseDevice.off('mouseup', this.onMouseUp, this);
                this.mouseDevice.off('scroll', this.onMouseScroll, this);
            },

            /**
            *   This method handles the mousedown event.
            *
            *   @method onMouseDown
            *   @param {mouseDown}
            *   @returns {undefined}
            */
            onMouseDown: function(mouseDevice) {
                this.handleMouseEvent('mousedown', mouseDevice);
            },

            /**
            *   This method handles the mouseup event.
            *
            *   @method onMouseUp
            *   @param {mouseUp}
            *   @returns {undefined}
            */
            onMouseUp: function(mouseDevice) {
                this.handleMouseEvent('mouseup', mouseDevice);
            },

            /**
            *   This method handles the mousescroll event.
            *
            *   @method onMouseScroll
            *   @param {mouseDevice}
            *   @returns {undefined}
            */
            onMouseScroll: function(mouseDevice) {
                this.handleMouseEvent('mousescroll', mouseDevice);
            },

            /**
            *   This method handles the mousemove event.
            *
            *   @method onMouseMove
            *   @param {mouseDevice}
            *   @returns {undefined}
            */
            onMouseMove: function(mouseDevice) {
                this.handleMouseEvent('mousemove', mouseDevice);
            },

            /**
            *   This function triggers the provided event name on all current
            *   entities if event propagation is enabled.
            *
            *   @method onMouseMove
            *   @returns {undefined}
            */
            handleMouseEvent: (function () {
                var _positionVec      = new Vector2();
                var _currCollisionMap = {};
                var _prevCollisionMap = {};
                var _topOfStack       = null;

                return function(eventName, mouseDevice) {
                    this.currInfoList.length = 0;

                    _positionVec.x = mouseDevice.relativeX;
                    _positionVec.y = this.graphicsDevice.getHeight() - mouseDevice.relativeY;

                    var key, entity, info;

                    // Clear the current collision map
                    for (key in _currCollisionMap) {
                        if (_currCollisionMap.hasOwnProperty(key)) {
                            delete _currCollisionMap[key];
                        }
                    }

                    // Raycast the mouse position against entities with box colliders
                    this.raycast(_positionVec, _currCollisionMap);

                    // MouseEnter, for each entity found under the mouse, check if it was previously found
                    for (key in _currCollisionMap) {
                        if (_currCollisionMap.hasOwnProperty(key)) {
                            info = _currCollisionMap[key];

                            // Create a list of current entities (used by mouseup, mousedown, mousescroll)
                            this.currInfoList.push(info);
                        }
                    }

                    
                    // Sort the mouseenter and mouseleave lists
                    this.sortByDepth(this.currInfoList);

                    // Handle the mouseenter and mouseleave events
                    if (this.currInfoList.length) {
                        if (_topOfStack !== this.currInfoList[0].entity) {
                            if (_topOfStack !== null) {
                                _topOfStack.trigger('mouseleave', mouseDevice, info);
                            }
                            _topOfStack = this.currInfoList[0].entity;
                            _topOfStack.trigger('mouseenter', mouseDevice, info);
                        }
                    } else {
                        if (_topOfStack !== null) {
                            _topOfStack.trigger('mouseleave', mouseDevice, info);
                        }
                        _topOfStack = null;
                    }

                    // Reset event propagation to enabled
                    mouseDevice.enableEventPropagation();

                    // Trigger the event type
                    var i, len = this.currInfoList.length;
                    for (i = 0; i < len; i++) {
                        entity = this.currInfoList[i].entity;
                        entity.trigger(eventName, mouseDevice);

                        if (!mouseDevice.isEventPropagationEnabled()) {
                            break;
                        }
                    }

                    // Swap the collision lists
                    var tmp = _prevCollisionMap;
                    _prevCollisionMap = _currCollisionMap;
                    _currCollisionMap = tmp;
                };
            })(),

            /**
            *   This method sorts the raycast collision list based on depth.
            *
            *   @method sortByDepth
            *   @returns {undefined}
            */
            sortByDepth: (function() {
                var _sortFunction = function(a, b) {
                    //return a.depth - b.depth || b.entity.id - a.entity.id;
                    return a.entity.id - b.entity.id;
                };
                return function(list) {
                    // Sort the collision list by depth
                    list.sort(_sortFunction);
                };
            })(),

            /**
            *   This method raycasts the mouse position into world space
            *   against rendered entities.
            *
            *   @method raycast
            *   @param {vec2Pos}
            *   @returns {undefined}
            */
            raycast: (function() {
                var _ray = new Ray();

                return function(vec2Pos, collisionMap) {
                    // For each camera
                    this.filterBy(['Transform', 'Camera'], function(entity) {
                        var camera = entity.getComponent('Camera');

                        // If the camera is active
                        if (camera.isEnabled() && camera.renderGroups.length > 0) {
                            var i, group;

                            camera.createPickingRay(vec2Pos, /*out*/ _ray);

                            //this.addDebugLine(ray);

                            // For each render group
                            for (i = 0; i < camera.renderGroups.length; i++) {
                                group = camera.renderGroups[i];

                                // Ray cast each entity that belongs to that group
                                this.raycastGroup(group, _ray, collisionMap);
                            }
                        }
                    }, this);
                };
            })(),

            /**
            *   This method handles a group of entites using the provided ray.
            *
            *   @method handleGroup
            *   @param {group} The group to handle input for
            *   @param {ray} The ray to use for the raycast
            *   @returns {undefined}
            */
            raycastGroup: function(group, ray, collisionMap) {
                this.filterBy(group, function(entity) {
                    this.raycastEntity(entity, ray, collisionMap);
                }, this);
            },

            /**
            *   Render an entity using the provided ray.
            *
            *   @method handleEntity
            *   @param {entity}
            *   @param {ray}
            *   @returns {undefined}
            */
            raycastEntity: function(entity, ray, collisionMap) {
                // Raycast the BoxCollider associated with this entity
                if (entity.hasComponent('ColliderBox')) {
                    this.raycastColliderBox(entity, ray, collisionMap);
                }

                // Raycast any child entities
                if (entity.hasChildren()) {
                    for (var i = 0; i < entity.children.length; i++) {
                        this.raycastEntity(entity.children[i], ray, collisionMap);
                    }
                }
            },

            /**
            *   This function applies the current render state and then draws
            *   an entity using the provided ray.
            *
            *   @method raycastColliderBox
            *   @param {entity}
            *   @param {ray}
            *   @returns {undefined}
            */
            raycastColliderBox: function(entity, ray, collisionMap) {
                var transform    = entity.getComponent('Transform');
                var colliderBox  = entity.getComponent('ColliderBox');

                // Transform the ray from world space into the mesh's model space
                var modelMatrix    = transform.getWorldMatrix();
                var modelInvMatrix = modelMatrix.clone().inverse();
                var localRay       = ray.clone().transform(modelInvMatrix);

                // Get the mesh bounding box
                var boundingBox = colliderBox.getBoundingBox();

                // Ray cast mouse position against mesh bounding box
                var rayTestResult = localRay.intersectBox(boundingBox);

                if (rayTestResult) {
                    // Bring the collision point back into world space
                    rayTestResult.transform(modelMatrix);

                    // Find the distance from the camera
                    var depth = Vector3.subtract(rayTestResult, ray.origin).length();
                    var info  = {
                        entity : entity,
                        depth  : depth,
                        point  : rayTestResult
                    };

                    // Add the collision info to the collision list
                    collisionMap[entity.id] = info;
                }
            },
            
            /**
            *   This method adds a red line entity using the provided ray
            *
            *   @method addDebugLine
            *   @param {ray}
            *   @returns {undefined}
            */
            addDebugLine: function(ray) {
                if (!this.meshFactory) {
                    var device = this.context.getGraphicsDevice();
                    this.meshFactory = new MeshFactory(device);
                }

                var mesh = new Mesh(this.device, Mesh.LINES);
                this.meshFactory.begin(mesh);

                var red  = new Vector4(132/22, 22/256, 22/256, 1);
                var gray = new Vector4(0.22, 0.22, 0.22, 1);

                var start = ray.origin.clone();
                var end   = ray.direction.clone();
                Vector3.multiplyScalar(end, 10, /*out*/ end);
                Vector3.add(start, end, /*out*/ end);

                this.meshFactory.addVertex(start);
                this.meshFactory.addVertex(end);
                this.meshFactory.addColor(red);
                this.meshFactory.addColor(gray);
                this.meshFactory.addLine(0, 1);

                this.meshFactory.end();

                var entity   = this.context.createNewEntity();
                var material = new Material(Material.BASIC);

                entity.addComponent(new Transform());
                entity.addComponent(new MeshFilter(mesh));
                entity.addComponent(new MeshRenderer(material));
                entity.name = 'raycast';
                entity.addToGroup('scene');
            }
        });

        return MouseController;
    }
);
