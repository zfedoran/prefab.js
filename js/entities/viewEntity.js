define([
        'lodash',
        'core/entity',
        'components/guiElement',
        'components/view',
        'components/inputMouse',
    ],
    function(
        _,
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

        ViewEntity.prototype = _.create(Entity.prototype, {
            constructor: ViewEntity
        });

        return ViewEntity;
    }
);
