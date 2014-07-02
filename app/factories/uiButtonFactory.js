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

            create: function(text, uiStyle) {
                var entity = this.context.createNewEntity('button-' + _count++);

                // UIButton component
                entity.addComponent(new Transform());
                entity.addComponent(new UIButton(text, uiStyle));
                entity.addComponent(new BoxCollider());

                // Child Entities
                var labelEntity = this.labelFactory.create(text, uiStyle.fontFamily, uiStyle.fontSize);
                var quadEntity  = this.quadFactory.create(uiStyle.normal);

                labelEntity.name = 'foreground';
                quadEntity.name  = 'background';

                var label = labelEntity.getComponent('Label');
                var quad  = quadEntity.getComponent('Quad');

                quad.useSlicedMode();
                
                label.anchor.set(1, -1, 0);
                quad.anchor.set(1, -1, 0);

                entity.addChild(quadEntity);
                entity.addChild(labelEntity);

                return entity;
            }
        });

        return UIButtonFactory;
    }
);
