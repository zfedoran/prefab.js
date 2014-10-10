define([
        'lodash',
        'core/controller'
    ], 
    function(
        _,
        Controller
    ) {
        'use strict';

        /**
        *   This class updates the colliders on entities which have a
        *   MeshFilter components.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var ColliderController = function(context) {
            Controller.call(this, context);
        };

        ColliderController.prototype = _.create(Controller.prototype, {
            constructor: ColliderController,

            /**
            *   Update all entities which contain the Collider and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'ColliderBox', 'MeshFilter'], function(entity) {
                    var colliderBox = entity.getComponent('ColliderBox');

                    if (colliderBox.isDirty()) {
                        var meshFilter  = entity.getComponent('MeshFilter');
                        var mesh        = meshFilter.getMesh();

                        if (mesh) {
                            var boundingBox = mesh.getBoundingBox();

                            colliderBox.setBoundingBox(boundingBox);
                            colliderBox.setDirty(false);
                        }
                    }
                }, this);
            }

        });

        return ColliderController;
    }
);
