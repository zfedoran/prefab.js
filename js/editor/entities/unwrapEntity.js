define([
        'core/entity',
        'components/transform',
        'components/meshFilter',
        'components/meshRenderer',
        'editor/components/unwrap'
    ],
    function(
        Entity,
        Transform,
        MeshFilter,
        MeshRenderer,
        Unwrap
    ) {
        'use strict';
    
        var UnwrapEntity = function(blockEntity) {
            Entity.call(this);

            var meshRenderer;
            if (typeof blockEntity !== 'undefined') {
                meshRenderer = blockEntity.getComponent('MeshRenderer');
            } else {
                meshRenderer = new MeshRenderer();
            }
            
            this.addComponent(new Transform());
            this.addComponent(new MeshFilter());
            this.addComponent(meshRenderer);
            this.addComponent(new Unwrap(blockEntity));
        };

        UnwrapEntity.prototype = Object.create(Entity.prototype);

        UnwrapEntity.prototype.constructor = UnwrapEntity;

        return UnwrapEntity;
    }
);
