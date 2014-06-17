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
                this.filterBy(['Transform', 'BoxCollider', 'MeshFilter'], function(entity) {
                    var boxCollider = entity.getComponent('BoxCollider');

                    if (boxCollider.isDirty()) {
                        var meshFilter  = entity.getComponent('MeshFilter');
                        var mesh        = meshFilter.getMesh();
                        var boundingBox = mesh.getBoundingBox();

                        boxCollider.setBoundingBox(boundingBox);
                        boxCollider.setDirty(false);
                    }
                }, this);
            }

        });

        return ColliderController;
    }
);
