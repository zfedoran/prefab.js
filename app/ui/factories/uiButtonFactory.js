define([
        'lodash',
        'core/factory',
        'ui/factories/uiElementFactory',
        'ui/factories/uiLabelFactory',
        'ui/factories/uiRectFactory',
        'ui/components/uiElement',
        'ui/components/uiButton'
    ],
    function(
        _,
        Factory,
        UIElementFactory,
        UILabelFactory,
        UIRectFactory,
        UIElement,
        UIButton
    ) {
        'use strict';
    
        var UIButtonFactory = function(context) {
            Factory.call(this, context);

            this.uiElementFactory = new UIElementFactory(context);
            this.uiLabelFactory   = new UILabelFactory(context);
            this.uiRectFactory    = new UIRectFactory(context);
        };

        UIButtonFactory.prototype = _.create(Factory.prototype, {
            construct: UIButtonFactory,

            create: function(name, text, uiElementStyle) {
                var entity = this.uiElementFactory.create(name);

                entity.addComponent(new UIButton(text, uiElementStyle));

                var uiButton = entity.getComponent('UIButton');

                // Create child entities
                var uiLabelEntity = this.uiLabelFactory.create(name + '-text', text, uiElementStyle);
                var uiRectEntity  = this.uiRectFactory.create(name + '-background', uiElementStyle);

                // Set child components
                uiButton.setUILabelComponent(uiLabelEntity.getComponent('UILabel'));
                uiButton.setUIRectComponent(uiRectEntity.getComponent('UIRect'));

                // Set the child hierarchy
                entity.addChild(uiRectEntity);
                entity.addChild(uiLabelEntity);

                return entity;
            }
        });

        return UIButtonFactory;
    }
);
