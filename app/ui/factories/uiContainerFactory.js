define([
        'lodash',
        'core/factory',
        'ui/factories/uiElementFactory',
        'ui/components/uiContainer'
    ],
    function(
        _,
        Factory,
        UIElementFactory,
        UIContainer
    ) {
        'use strict';
    
        var UIContainerFactory = function(context) {
            Factory.call(this, context);

            this.uiElementFactory = new UIElementFactory(context);
        };

        UIContainerFactory.prototype = _.create(Factory.prototype, {
            construct: UIContainerFactory,

            create: function(name, uiElementStyle) {
                var entity = this.uiElementFactory.create(name);

                entity.addComponent(new UIContainer(uiElementStyle));

                return entity;
            }
        });

        return UIContainerFactory;
    }
);
