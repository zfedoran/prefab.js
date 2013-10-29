define([
        'underscore',
        'core/subSystem'
    ],
    function(
        _,
        SubSystem
    ) {
    
        var RenderSystem = function(entityManager, device) {
            SubSystem.call(this, entityManager, ['Transform', 'MeshRenderer']);
            this.device = device;
        };

        RenderSystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: RenderSystem,
            update: function() {
                var entities = this.entityManager.getAllUsingFilter(this.filterHash);
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
                    meshFilter.setDirty(false);
                }
            }
        });

        return RenderSystem;
    }
);
