define([
        'lodash',
        'core/factory',
        'factories/baseFactory',
        'components/colliderBox'
    ],
    function(
        _,
        Factory,
        BaseFactory,
        ColliderBox
    ) {
        'use strict';
    
        var UIElementFactory = function(context) {
            Factory.call(this, context);

            this.baseFactory = new BaseFactory(context);
        };

        UIElementFactory.prototype = _.create(Factory.prototype, {
            construct: UIElementFactory,

            create: function(name, material) {
                var entity = this.baseFactory.create(name);
                entity.setAnchorPoint(1, -1, 0);

                entity.addComponent(new ColliderBox());

                return entity;
            }
        });

        return UIElementFactory;
    }
);
