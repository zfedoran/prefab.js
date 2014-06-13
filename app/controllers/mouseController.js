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
                var vec2Pos = new Vector2(event.pageX, event.pageY);

                // For each camera
                this.filterBy(['Transform', 'Camera'], function(entity) {
                    var camera = entity.getComponent('Camera');

                    // If the camera is active
                    if (camera.isEnabled() && camera.renderGroups.length > 0) {
                        var i, group;

                        if (event.type === 'click') {
                            var vec2Pos = new Vector2(event.mouseX, event.mouseY);
                            var ray     = camera.createPickingRay(vec2Pos);
                            this.addDebugLine(ray);
                        }


                        // For each render group
                        for (i = 0; i < camera.renderGroups.length; i++) {
                            group = camera.renderGroups[i];

                            // Ray cast each entity that belongs to that group
                            this.raycastGroup(group, camera, event);
                        }
                    }
                }, this);
            },

            /**
            *   This method handles a group of entites using the provided ray.
            *
            *   @method handleGroup
            *   @param {group} The group to handle input for
            *   @param {camera} The camera to use for the raycast
            *   @returns {undefined}
            */
            raycastGroup: function(group, camera, event) {
                this.filterBy(group, function(entity) {
                    this.raycastEntity(entity, camera, event);
                }, this);
            },

            /**
            *   Render an entity using the provided ray.
            *
            *   @method handleEntity
            *   @param {entity}
            *   @param {camera}
            *   @returns {undefined}
            */
            raycastEntity: function(entity, camera, event) {
                // Render the mesh associated with this entity
                if (entity.hasComponent('MeshFilter')) {
                    this.raycastMesh(entity, camera, event);
                }

                // Render any child entities
                if (entity.hasChildren()) {
                    for (var i = 0; i < entity.children.length; i++) {
                        this.raycastEntity(entity.children[i], camera, event);
                    }
                }
            },

            /**
            *   This function applies the current render state and then draws
            *   an entity using the provided ray.
            *
            *   @method handleInput
            *   @param {entity}
            *   @param {camera}
            *   @returns {undefined}
            */
            raycastMesh: function(entity, camera, event) {
                var transform    = entity.getComponent('Transform');
                var meshFilter   = entity.getComponent('MeshFilter');
                var mesh         = meshFilter.mesh;

                if (typeof mesh === 'undefined') {
                    return;
                }

                if (event.type !== 'click') {
                    return;
                }

                var vec2Pos = new Vector2(event.mouseX, event.mouseY);
                var ray     = camera.createPickingRay(vec2Pos);

                // Transform the ray from world space into the mesh's model space
                var modelInv = transform.getWorldMatrix().clone();
                modelInv.inverse();
                
                ray.transform(modelInv);

                // Get the mesh bounding box
                var boundingBox   = mesh.getBoundingBox();

                // Ray cast mouse position against mesh bounding box
                var rayTestResult = ray.intersectBox(boundingBox);

                if (rayTestResult && entity.name !== 'grid' && entity.name !== 'raycast') {
                    console.log(entity.name);
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
