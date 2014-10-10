define([
        'lodash',
        'core/factory',
        'ui/factories/uiElementFactory',
        'ui/factories/uiTextFactory',
        'ui/factories/uiRectFactory',
        'ui/components/uiElement',
        'ui/components/uiButton'
    ],
    function(
        _,
        Factory,
        UIElementFactory,
        UITextFactory,
        UIRectFactory,
        UIElement,
        UIButton
    ) {
        'use strict';
    
        var UIButtonFactory = function(context) {
            Factory.call(this, context);

            this.uiElementFactory = new UIElementFactory(context);
            this.uiTextFactory    = new UITextFactory(context);
            this.uiRectFactory    = new UIRectFactory(context);
        };

        UIButtonFactory.prototype = _.create(Factory.prototype, {
            construct: UIButtonFactory,

            create: function(name, text, uiElementStyle) {
                var entity = this.uiElementFactory.create(name);

                entity.addComponent(new UIButton(text, uiElementStyle));

                var uiButton = entity.getComponent('UIButton');

                // Create child entities
                var uiTextEntity = this.uiTextFactory.create(name + '-text', text, uiElementStyle);
                var uiRectEntity = this.uiRectFactory.create(name + '-background', uiElementStyle);

                // Set child components
                uiButton.setUITextComponent(uiTextEntity.getComponent('UIText'));
                uiButton.setUIRectComponent(uiRectEntity.getComponent('UIRect'));

                // Set the child hierarchy
                entity.addChild(uiRectEntity);
                entity.addChild(uiTextEntity);

                // Tag entities to make them more easily accessible later
                entity.tagEntity(uiRectEntity);
                entity.tagEntity(uiTextEntity);

                return entity;
            }
        });

        return UIButtonFactory;
    }
);
