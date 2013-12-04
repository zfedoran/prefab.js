define([
        'core/component'
    ],
    function(
        Component
    ) {
        'use strict';
    
        var MeshRenderer = function() {
            Component.call(this);

            this.castShadows = false;
            this.receiveShadows = false;
            this.material = undefined;
        };

        MeshRenderer.__name__ = 'MeshRenderer';

        MeshRenderer.prototype = Object.create(Component.prototype);

        MeshRenderer.prototype.constructor = MeshRenderer;

        return MeshRenderer;
    }
);
