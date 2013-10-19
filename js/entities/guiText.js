define([
        'core/entity',
        'components/transform',
        'components/guiText',
        'components/meshFilter',
        'components/meshRenderer'
    ],
    function(
        Entity,
        Transform,
        GUIText,
        MeshFilter,
        MeshRenderer
    ) {

        var GUITextEntity = function(rect, text, options) {
            Entity.call(this);

            this.addComponent(new Transform());
            this.addComponent(new GUIText(rect, text, options));
            this.addComponent(new MeshFilter());
            this.addComponent(new MeshRenderer());
        };

        GUITextEntity.prototype = Object.create(Entity.prototype);

        GUITextEntity.prototype.construct = GUITextEntity;

        return GUITextEntity;
    }
);
