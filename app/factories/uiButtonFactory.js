define([
        'lodash',
        'core/factory',
        'factories/labelFactory',
        'factories/quadFactory',
        'components/transform',
        'components/uiButton',
        'components/boxCollider'
    ],
    function(
        _,
        Factory,
        LabelFactory,
        QuadFactory,
        Transform,
        UIButton,
        BoxCollider
    ) {
        'use strict';
    
        var _count = 0;

        var UIButtonFactory = function(context) {
            Factory.call(this, context);

            this.labelFactory = new LabelFactory(context);
            this.quadFactory  = new QuadFactory(context);
        };

        UIButtonFactory.prototype = _.create(Factory.prototype, {
            construct: UIButtonFactory,

            create: function(text, uiElementStyle) {
                var entity = this.context.createNewEntity('button-' + _count++);

                // UIButton component
                entity.addComponent(new Transform());
                entity.addComponent(new UIButton(text, uiElementStyle));
                entity.addComponent(new BoxCollider());

                // Child Entities
                var labelEntity = this.labelFactory.create(text, uiElementStyle.fontFamily, uiElementStyle.fontSize);
                var quadEntity  = this.quadFactory.create(uiElementStyle.normal);

                labelEntity.name = 'foreground';
                quadEntity.name  = 'background';

                var quad = quadEntity.getComponent('Quad');
                quad.useSlicedMode();

                entity.addChild(quadEntity);
                entity.addChild(labelEntity);

                return entity;
            }
        });

        return UIButtonFactory;
    }
);
