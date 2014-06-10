define([
        'lodash',
        'core/controller',
        'math/vector2',
        'math/matrix4',
        'math/ray'
    ],
    function(
        _,
        Controller,
        Vector2,
        Matrix4,
        Ray
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

                        // Create a ray object from the camera view/proj
                        var transform   = entity.getComponent('Transform');
                        var worldMatrix = transform.getWorldMatrix();
                        var ray         = camera.createPickingRay(worldMatrix, vec2Pos);

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
                // Render the mesh associated with this entity
                if (entity.hasComponent('MeshFilter')) {
                    this.raycastMesh(entity, ray);
                }

                // Render any child entities
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
            raycastMesh: function(entity, ray) {
                var transform    = entity.getComponent('Transform');
                var meshFilter   = entity.getComponent('MeshFilter');
                var mesh         = meshFilter.mesh;

                if (typeof mesh === 'undefined') {
                    return;
                }

                // Get the mesh bounding box
                var boundingBox    = mesh.getBoundingBox();

                // Convert the Ray to be in the bounding box space
                var worldInvMatrix = new Matrix4();
                var localRay       = new Ray();

                worldInvMatrix.setFrom(transform.getWorldMatrix());
                worldInvMatrix.inverse();

                localRay.setFrom(ray);
                localRay.transform(worldInvMatrix);

                // Ray cast mouse position against mesh bounding box
                var rayTestResult = localRay.intersectBox(boundingBox);

                if (rayTestResult !== null) {
                    console.log(rayTestResult.toString());
                }
            }
        });

        return MouseController;
    }
);
