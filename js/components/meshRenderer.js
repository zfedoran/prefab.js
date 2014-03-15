define([
        'lodash',
        'core/component',
        'graphics/material'
    ],
    function(
        _,
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

        MeshRenderer.prototype = _.create(Component.prototype, {
            constructor: MeshRenderer
        });

        return MeshRenderer;
    }
);
