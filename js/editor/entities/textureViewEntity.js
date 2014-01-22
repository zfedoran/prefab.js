define([
        'core/entity',
        'components/guiElement',
        'editor/components/view',
        'editor/components/textureView'
    ],
    function(
        Entity,
        GUIElement,
        View,
        TextureView
    ) {
        'use strict';
    
        var TextureViewEntity = function(viewRect, zoom) {
            Entity.call(this);

            zoom = zoom || 10;

            this.addComponent(new GUIElement(viewRect));
            this.addComponent(new View(View.TYPE_TEXTURE));
            this.addComponent(new TextureView(zoom));
        };

        TextureViewEntity.prototype = Object.create(Entity.prototype);

        TextureViewEntity.prototype.constructor = TextureViewEntity;

        return TextureViewEntity;
    }
);
