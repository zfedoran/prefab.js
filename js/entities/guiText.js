define([
        'math/vector3',
        'core/entity',
        'components/transform',
        'components/guiElement',
        'components/guiText',
        'components/meshFilter',
        'components/meshRenderer'
    ],
    function(
        Vector3,
        Entity,
        Transform,
        GUIElement,
        GUIText,
        MeshFilter,
        MeshRenderer
    ) {
        'use strict';

        var GUITextEntity = function(rect, text) {
            Entity.call(this);

            var position = new Vector3(rect.x, rect.y, 0);
            this.addComponent(new Transform(position));
            this.addComponent(new GUIElement(rect));
            this.addComponent(new GUIText(text));
            this.addComponent(new MeshFilter());
            this.addComponent(new MeshRenderer());
        };

        GUITextEntity.prototype = Object.create(Entity.prototype);

        GUITextEntity.prototype.construct = GUITextEntity;

        return GUITextEntity;
    }
);
