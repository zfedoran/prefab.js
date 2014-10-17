define([
        'lodash',
        'core/factory',
        'factories/quadFactory',
        'ui/factories/uiElementFactory',
        'ui/factories/uiLabelFactory',
        'ui/factories/uiRectFactory',
        'ui/components/uiElement',
        'ui/components/uiTextBox',
        'components/scissorTest'
    ],
    function(
        _,
        Factory,
        QuadFactory,
        UIElementFactory,
        UILabelFactory,
        UIRectFactory,
        UIElement,
        UITextBox,
        ScissorTest
    ) {
        'use strict';
    
        var UITextBoxFactory = function(context) {
            Factory.call(this, context);

            this.uiElementFactory = new UIElementFactory(context);
            this.uiLabelFactory   = new UILabelFactory(context);
            this.uiRectFactory    = new UIRectFactory(context);
            this.quadFactory      = new QuadFactory(context);
        };

        UITextBoxFactory.prototype = _.create(Factory.prototype, {
            construct: UITextBoxFactory,

            create: function(name, text, uiElementStyle) {
                var entity = this.uiElementFactory.create(name);

                entity.addComponent(new UITextBox(text, uiElementStyle));
                entity.addComponent(new ScissorTest(true));

                var uiTextBox = entity.getComponent('UITextBox');

                // Child Entities
                var uiLabelEntity  = this.uiLabelFactory.create(name + '-text', text, uiElementStyle);
                var uiRectEntity   = this.uiRectFactory.create(name + '-background', uiElementStyle);
                var cursorEntity   = this.quadFactory.create(name + '-cursor', null, 1, uiTextBox.getCurrentStyle().fontSize);

                // Set child components
                uiTextBox.setUILabelComponent(uiLabelEntity.getComponent('UILabel'));
                uiTextBox.setUIRectComponent(uiRectEntity.getComponent('UIRect'));
                uiTextBox.setCursorQuadComponent(cursorEntity.getComponent('Quad'));
                
                // Set the child hierarchy
                entity.addChild(uiRectEntity);
                entity.addChild(uiLabelEntity);
                entity.addChild(cursorEntity);

                return entity;
            }
        });

        return UITextBoxFactory;
    }
);
