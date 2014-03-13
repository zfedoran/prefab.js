define([
        'components/view',
        'entities/viewEntity',
        'editor/components/textureView'
    ],
    function(
        View,
        ViewEntity,
        TextureView
    ) {
        'use strict';
    
        var TextureViewEntity = function(viewRect, zoom) {
            ViewEntity.apply(this, [viewRect]);

            zoom = zoom || 10;

            var view = this.getComponent('View');
            view.type = View.TYPE_TEXTURE;

            this.addComponent(new TextureView(zoom));
        };

        TextureViewEntity.prototype = Object.create(ViewEntity.prototype);

        TextureViewEntity.prototype.constructor = TextureViewEntity;

        return TextureViewEntity;
    }
);
