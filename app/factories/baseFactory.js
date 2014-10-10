define([
        'lodash',
        'core/factory',
        'components/anchor',
        'components/bounds',
        'components/dimensions',
        'components/transform'
    ],
    function(
        _,
        Factory,
        Anchor,
        Bounds,
        Dimensions,
        Transform
    ) {
        'use strict';
    
        var BaseFactory = function(context) {
            Factory.call(this, context);
        };

        BaseFactory.prototype = _.create(Factory.prototype, {
            construct: BaseFactory,

            create: function(name) {
                var entity = this.context.createNewEntity(name);

                entity.addComponent(new Anchor());
                entity.addComponent(new Dimensions());
                entity.addComponent(new Bounds());
                entity.addComponent(new Transform());

                return entity;
            }
        });

        return BaseFactory;
    }
);
