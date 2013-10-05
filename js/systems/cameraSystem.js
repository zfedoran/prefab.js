define([
        'components/transform',
        'components/projection',
        'components/view',
        'math/matrix4'
    ],
    function(
        Transform,
        Projection,
        View,
        Matrix4
    ) {

        var CameraSystem = function(entityManager) {
            this.filter = 'has(transform,projection,view)';
            this.entityManager = entityManager;
            this.entityManager.addFilter(this.filter, function(entity) {
                return entity.hasComponent(Transform)
                    && entity.hasComponent(Projection)
                    && entity.hasComponent(View);
            });
        };

        CameraSystem.prototype = {
            constructor: CameraSystem,
            updateProjectionMatrix: function(entity) {
                var proj = entity.getComponent(Projection);
                if (proj.isDirty()) {
                    proj.aspect = proj.width / proj.height;
                    if (proj.isOrthographic()) {
                        Matrix4.createOrthographic(0, proj.width, 0, proj.height, proj.near, proj.far, /*out*/ proj._projectionMatrix);
                    } else {
                        Matrix4.createPerspective(proj.fov, proj.aspect, proj.near, proj.far, /*out*/ proj._projectionMatrix);
                    }
                }
            },
            updateViewMatrix: function(entity) {
                var view = entity.getComponent(View);
                var transform = entity.getComponent(Transform);

                if (view.isDirty()) {
                    if (view.hasTarget()) {
                        Matrix4.createLookAt(transform.getPosition(), 
                                            view.getTargetPosition(), 
                                            view.up, 
                                            /*out*/ view._viewMatrix);
                    } else {
                        // If you only have the camera transformation and you want
                        // to compute the view matrix that will correctly transform
                        // vertices from world-space to view-space, you only need 
                        // to take the inverse of the camera transform.
                        Matrix4.inverse(transform.getWorldMatrix(), view._viewMatrix);
                    }
                }
            },
            update: function() {
                var entities = this.entityManager.getAllUsingFilter(this.filter);
                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        this.updateProjectionMatrix(entity);
                        this.updateViewMatrix(entity);
                    }
                }
            }
        };

        return CameraSystem;
    }
);
