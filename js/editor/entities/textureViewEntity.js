define([
        'lodash',
        'components/view',
        'entities/viewEntity',
        'editor/components/textureView'
    ],
    function(
        _,
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

        TextureViewEntity.prototype = _.create(ViewEntity.prototype, {
            constructor: TextureViewEntity
        });

        return TextureViewEntity;
    }
);
