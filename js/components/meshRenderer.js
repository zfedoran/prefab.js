define([
        'core/component',
        'graphics/material'
    ],
    function(
        Component,
        Material
    ) {
        'use strict';
    
        var MeshRenderer = function(material) {
            Component.call(this);

            this.castShadows = false;
            this.receiveShadows = false;
            this.material = material;
        };

        MeshRenderer.__name__ = 'MeshRenderer';

        MeshRenderer.prototype = Object.create(Component.prototype);

        MeshRenderer.prototype.constructor = MeshRenderer;

        return MeshRenderer;
    }
);
