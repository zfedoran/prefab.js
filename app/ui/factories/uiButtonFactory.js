define([
        'lodash',
        'core/factory',
        'factories/quadFactory',
        'components/transform',
        'components/boxCollider',
        'ui/factories/uiTextFactory',
        'ui/components/uiElement',
        'ui/components/uiButton'
    ],
    function(
        _,
        Factory,
        QuadFactory,
        Transform,
        BoxCollider,
        UITextFactory,
        UIElement,
        UIButton
    ) {
        'use strict';
    
        var _count = 0;

        var UIButtonFactory = function(context) {
            Factory.call(this, context);

            this.uiTextFactory = new UITextFactory(context);
            this.quadFactory   = new QuadFactory(context);
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
                var defaultStyle  = entity.getComponent('UIButton').getCurrentStyle();
                var uiTextEntity  = this.uiTextFactory.create(text, defaultStyle.fontFamily, defaultStyle.fontSize);
                var quadEntity    = this.quadFactory.create(defaultStyle.background);

                uiTextEntity.name = 'foreground';
                quadEntity.name   = 'background';

                var uiText        = uiTextEntity.getComponent('UIText');
                var quad          = quadEntity.getComponent('Quad');

                quad.useSlicedMode();
                
                // Set anchor positions
                uiText.anchor.set(1, -1, 0);
                quad.anchor.set(1, -1, 0);

                // Set the child hierarchy
                entity.addChild(quadEntity);
                entity.addChild(uiTextEntity);

                // Tag entities to make them more easily accessible later
                entity.tagEntity(quadEntity);
                entity.tagEntity(uiTextEntity);

                return entity;
            }
        });

        return UIButtonFactory;
    }
);
