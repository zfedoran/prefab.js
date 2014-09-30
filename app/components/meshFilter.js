define([
        'lodash',
        'core/component'
    ],
    function(
        _,
        Component
    ) {
        'use strict';

        var MeshFilter = function(mesh) {
            Component.call(this);

            this.mesh        = mesh;
            this.clippedMesh = null;
        };

        MeshFilter.__name__ = 'MeshFilter';

        MeshFilter.prototype = _.create(Component.prototype, {
            constructor: MeshFilter,

            /**
            *   This method is called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            init: function(entity, context) {
            },

            /**
            *   This method is called when this component is removed from an
            *   entity.
            *
            *   @method uninitialize
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            uninitialize: function(entity, context) {
            },

            /**
            *   Returns the mesh for this mesh filter.
            *
            *   @method getMesh
            *   @returns {undefined}
            */
            getMesh: function() {
                return this.mesh;
            },

            /**
            *   Sets the mesh for this mesh filter component.
            *
            *   @method setMesh
            *   @param {mesh}
            *   @returns {undefined}
            */
            setMesh: function(mesh) {
                this.mesh = mesh;
            },

            /**
            *   Returns a clipped mesh for this mesh filter.
            *   (Note: usually clipped by a MeshClip component)
            *
            *   @method getClippedMesh
            *   @returns {undefined}
            */
            getClippedMesh: function() {
                return this.clippedMesh;
            },

            /**
            *   Sets the clipped mesh for this mesh filter component.
            *
            *   @method setClippedMesh
            *   @param {mesh}
            *   @returns {undefined}
            */
            setClippedMesh: function(mesh) {
                this.clippedMesh = mesh;
            },

            /**
            *   Returns whether this component mesh has been clipped.
            *   (Note: usually clipped by a MeshClip component)
            *
            *   @method hasClippedMesh
            *   @returns {undefined}
            */
            hasClippedMesh: function() {
                return this.clippedMesh;
            }
        });

        return MeshFilter;
    }
);
