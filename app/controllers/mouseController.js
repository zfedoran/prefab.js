define([
        'lodash',
        'core/controller',
        'math/vector2',
        'math/vector3',
        'math/vector4',
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

            this.prevCollisionList = [];
            this.currCollisionList = [];

            this.graphicsDevice = this.context.getGraphicsDevice();
            this.mouseDevice    = this.context.getMouseDevice();

            this.initEvents();
        };

        MouseController.prototype = _.create(Controller.prototype, {
            constructor: MouseController,

            /**
            *   This function binds the controller to the mouse device events.
            *
            *   @method initEvents
            *   @returns {undefined}
            */
            initEvents: function() {
                // All events that this controller handles
                this.events = [
                    'mousemove',
                    'mousedown',
                    'mouseup',
                    'mousescroll'
                ].join(' ');

                this.mouseDevice.on(this.events, this.onMouseEvent, this);
            },

            /**
            *   This function removes the events bound to the mouse device.
            *
            *   @method removeEvents
            *   @returns {undefined}
            */
            removeEvents: function() {
                this.mouseDevice.off(this.events, this.onMouseEvent, this);
            },

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
            *   This function handles mouse events.
            *
            *   @method onMouseEvent
            *   @returns {undefined}
            */
            onMouseEvent: function(event) {
                // Clear the current collision list
                this.currCollisionList.length = 0;

                // Raycast the mouse position against entities with box colliders
                this.raycast(this.getMousePosition());

                // Sort the collision list by depth
                this.currCollisionList.sort(function (a, b) {
                    return a.depth - b.depth;
                });

                //TODO: This should be optimized
                var mouseenterDiff = _.difference(_.pluck(this.currCollisionList, 'entity'), _.pluck(this.prevCollisionList, 'entity'));
                var mouseenter     = _.filter(this.currCollisionList, function(obj) { return mouseenterDiff.indexOf(obj.entity) >= 0; });

                var mouseleaveDiff = _.difference(_.pluck(this.prevCollisionList, 'entity'), _.pluck(this.currCollisionList, 'entity'));
                var mouseleave     = _.filter(this.prevCollisionList, function(obj) { return mouseleaveDiff.indexOf(obj.entity) >= 0; });

                var i, len, info;

                // Trigger mouseenter events
                for (i = 0, len = mouseenter.length; i < len; i++) {
                    info = mouseenter[i];
                    info.entity.trigger('mouseenter', this.mouseDevice);
                }

                // Trigger mouseleave events
                for (i = 0, len = mouseleave.length; i < len; i++) {
                    info = mouseleave[i];
                    info.entity.trigger('mouseleave', this.mouseDevice);
                }

                // Trigger click, mousedown, mouseup, mousemove, and scroll events on entities
                for (i = 0, len = this.currCollisionList.length; i < len; i++) {
                    info = this.currCollisionList[i];
                    info.entity.trigger(event, this.mouseDevice);
                }

                // Swap the collision lists
                var tmp = this.prevCollisionList;
                this.prevCollisionList = this.currCollisionList;
                this.currCollisionList = tmp;
            },

            /**
            *   This function returns the current mouse position with the
            *   origin in the lower left corner.
            *
            *   @method getMousePosition
            *   @returns {vector2}
            */
            getMousePosition: (function() {
                var position = new Vector2();
                return function() {
                    position.x = this.mouseDevice.relativeX;
                    position.y = this.graphicsDevice.getHeight() - this.mouseDevice.relativeY;
                    return position;
                };
            })(),

            /**
            *   This method raycasts the mouse position into world space
            *   against rendered entities.
            *
            *   @method raycast
            *   @param {pos}
            *   @returns {undefined}
            */
            raycast: function(pos) {
                // For each camera
                this.filterBy(['Transform', 'Camera'], function(entity) {
                    var camera = entity.getComponent('Camera');

                    // If the camera is active
                    if (camera.isEnabled() && camera.renderGroups.length > 0) {
                        var i, group;

                        var ray = camera.createPickingRay(pos);

                        //this.addDebugLine(ray);

                        // For each render group
                        for (i = 0; i < camera.renderGroups.length; i++) {
                            group = camera.renderGroups[i];

                            // Ray cast each entity that belongs to that group
                            this.raycastGroup(group, ray);
                        }
                    }
                }, this);

            },

            /**
            *   This method handles a group of entites using the provided ray.
            *
            *   @method handleGroup
            *   @param {group} The group to handle input for
            *   @param {ray} The ray to use for the raycast
            *   @returns {undefined}
            */
            raycastGroup: function(group, ray) {
                this.filterBy(group, function(entity) {
                    this.raycastEntity(entity, ray);
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
            raycastEntity: function(entity, ray) {
                // Raycast the BoxCollider associated with this entity
                if (entity.hasComponent('BoxCollider')) {
                    this.raycastBoxCollider(entity, ray);
                }

                // Raycast any child entities
                if (entity.hasChildren()) {
                    for (var i = 0; i < entity.children.length; i++) {
                        this.raycastEntity(entity.children[i], ray);
                    }
                }
            },

            /**
            *   This function applies the current render state and then draws
            *   an entity using the provided ray.
            *
            *   @method handleInput
            *   @param {entity}
            *   @param {ray}
            *   @returns {undefined}
            */
            raycastBoxCollider: function(entity, ray) {
                var transform    = entity.getComponent('Transform');
                var boxCollider  = entity.getComponent('BoxCollider');

                // Transform the ray from world space into the mesh's model space
                var modelMatrix    = transform.getWorldMatrix();
                var modelInvMatrix = modelMatrix.clone().inverse();
                var localRay       = ray.clone().transform(modelInvMatrix);

                // Get the mesh bounding box
                var boundingBox = boxCollider.getBoundingBox();

                // Ray cast mouse position against mesh bounding box
                var rayTestResult = localRay.intersectBox(boundingBox);

                if (rayTestResult) {
                    // Bring the collision point back into world space
                    rayTestResult.transform(modelMatrix);

                    // Find the distance from the camera
                    var depth = Vector3.subtract(rayTestResult, ray.origin).length();

                    // Add the collision info to the collision list
                    this.currCollisionList.push({
                        entity: entity,
                        depth: depth,
                        point: rayTestResult
                    });
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
