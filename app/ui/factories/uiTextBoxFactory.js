define([
        'lodash',
        'core/factory',
        'factories/quadFactory',
        'ui/factories/uiElementFactory',
        'ui/factories/uiTextFactory',
        'ui/factories/uiRectFactory',
        'ui/components/uiElement',
        'ui/components/uiTextBox'
    ],
    function(
        _,
        Factory,
        QuadFactory,
        UIElementFactory,
        UITextFactory,
        UIRectFactory,
        UIElement,
        UITextBox
    ) {
        'use strict';
    
        var UITextBoxFactory = function(context) {
            Factory.call(this, context);

            this.uiElementFactory = new UIElementFactory(context);
            this.uiTextFactory    = new UITextFactory(context);
            this.uiRectFactory    = new UIRectFactory(context);
            this.quadFactory      = new QuadFactory(context);
        };

        UITextBoxFactory.prototype = _.create(Factory.prototype, {
            construct: UITextBoxFactory,

            create: function(name, text, uiElementStyle) {
                var entity = this.uiElementFactory.create(name);

                entity.addComponent(new UITextBox(text, uiElementStyle));

                var uiTextBox = entity.getComponent('UITextBox');

                // Child Entities
                var uiTextEntity   = this.uiTextFactory.create(name + '-text', text, uiElementStyle);
                var uiRectEntity   = this.uiRectFactory.create(name + '-background', uiElementStyle);
                var cursorEntity   = this.quadFactory.create(name + '-cursor', null, 1, uiTextBox.getCurrentStyle().fontSize);

                // Set child components
                uiTextBox.setUITextComponent(uiTextEntity.getComponent('UIText'));
                uiTextBox.setUIRectComponent(uiRectEntity.getComponent('UIRect'));
                uiTextBox.setCursorQuadComponent(cursorEntity.getComponent('Quad'));
                
                // Set the child hierarchy
                entity.addChild(uiRectEntity);
                entity.addChild(uiTextEntity);
                entity.addChild(cursorEntity);

                // Tag entities to make them more easily accessible later
                entity.tagEntity(uiTextEntity);
                entity.tagEntity(uiRectEntity);
                entity.tagEntity(cursorEntity);

                return entity;
            }
        });

        return UITextBoxFactory;
    }
);
