define([
    ],
    function(
    ) {
    
        var RenderSystem = function(entityManager, device) {
            this.filter = 'has(renderer)';
            this.entityManager = entityManager;
            this.entityManager.addFilter(this.filter, function(entity) {
                return entity.hasComponent('Transform')
                    && entity.hasComponent('MeshRenderer');
            });

            this.device = device;
        };

        RenderSystem.prototype = {
            constructor: RenderSystem,
            update: function() {
                var entities = this.entityManager.getAllUsingFilter(this.filter);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('MeshFilter')) {
                            this.updateMesh(entity);
                        }
                    }
                }
            },
            updateMesh: function(entity) {
                var transform  = entity.getComponent('Transform');
                var meshFilter = entity.getComponent('MeshFilter');

                if (meshFilter.isDirty()) {
                    meshFilter.mesh.apply(this.device);
                }
            }
        };

        return RenderSystem;
    }
);
