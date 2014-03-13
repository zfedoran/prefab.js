define([
        'core/entity',
        'components/guiElement',
        'components/view',
        'components/inputMouse',
    ],
    function(
        Entity,
        GUIElement,
        View,
        InputMouse,
        TextureView
    ) {
        'use strict';
    
        var ViewEntity = function(viewRect) {
            Entity.call(this);

            this.addComponent(new GUIElement(viewRect));
            this.addComponent(new View());
            this.addComponent(new InputMouse());
        };

        ViewEntity.prototype = Object.create(Entity.prototype);

        ViewEntity.prototype.constructor = ViewEntity;

        return ViewEntity;
    }
);
