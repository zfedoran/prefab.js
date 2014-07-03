define([
        'lodash',
        'core/controller',
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/matrix4',
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
        Matrix4,
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

            var device = this.context.getGraphicsDevice();
            this.meshFactory = new MeshFactory(device);

            this.prevCollisionList = [];
            this.currCollisionList = [];
        };

        MouseController.prototype = _.create(Controller.prototype, {
            constructor: MouseController,

            /**
            *   This method calls the handle input method on each entity that
            *   is part of an active camera render group.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                throw 'MouseController: the update() function does not do anything';
            },

            /**
            *   This method calls the appropriate event handler based on the
            *   event type.
            *
            *   @method handleEvent
            *   @param {event}
            *   @returns {undefined}
            */
            handleEvent: function(event) {

                // Clear the current collision list
                this.currCollisionList.length = 0;

                // Raycast the mouse position against entities with box colliders
                this.raycast(new Vector2(event.mouseX, event.mouseY));

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
                    event.type = 'mouseenter';
                    info = mouseenter[i];
                    info.entity.trigger('mouseenter', event);
                }

                // Trigger mouseleave events
                for (i = 0, len = mouseleave.length; i < len; i++) {
                    event.type = 'mouseleave';
                    info = mouseleave[i];
                    info.entity.trigger('mouseleave', event);
                }

                // Trigger click, mousedown, mouseup, mousemove, and scroll events on entities
                for (i = 0, len = this.currCollisionList.length; i < len; i++) {
                    info = this.currCollisionList[i];
                    info.entity.trigger(event.type, event);
                }

                // Swap the collision lists
                var tmp = this.prevCollisionList;
                this.prevCollisionList = this.currCollisionList;
                this.currCollisionList = tmp;
            },

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
