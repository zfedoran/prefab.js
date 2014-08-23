define([
        'lodash',
        'core/factory',
        'factories/labelFactory',
        'factories/quadFactory',
        'components/transform',
        'components/uiElement',
        'components/uiInput',
        'components/boxCollider'
    ],
    function(
        _,
        Factory,
        LabelFactory,
        QuadFactory,
        Transform,
        UIElement,
        UIInput,
        BoxCollider
    ) {
        'use strict';
    
        var _count = 0;

        var UIInputFactory = function(context) {
            Factory.call(this, context);

            this.labelFactory = new LabelFactory(context);
            this.quadFactory  = new QuadFactory(context);
        };

        UIInputFactory.prototype = _.create(Factory.prototype, {
            construct: UIInputFactory,

            create: function(text, uiElementStyle) {
                var entity = this.context.createNewEntity('input-' + _count++);

                // UIInput component
                entity.addComponent(new Transform());
                entity.addComponent(new UIInput(text, uiElementStyle));
                entity.addComponent(new BoxCollider());

                // Child Entities
                var defaultStyle = entity.getComponent('UIInput').getCurrentStyle();
                var labelEntity  = this.labelFactory.create(text, defaultStyle.fontFamily, defaultStyle.fontSize);
                var quadEntity   = this.quadFactory.create(defaultStyle.background);
                var cursorEntity = this.quadFactory.create(null, 1, defaultStyle.fontSize);

                labelEntity.name  = 'foreground';
                quadEntity.name   = 'background';
                cursorEntity.name = 'cursor';

                var foregroundLabel = labelEntity.getComponent('Label');
                var backgroundQuad  = quadEntity.getComponent('Quad');
                var cursorQuad      = cursorEntity.getComponent('Quad');

                // Tell the background quad to slice up the sprite
                backgroundQuad.useSlicedMode();
                
                // Set anchor positions
                foregroundLabel.anchor.set(1, -1, 0);
                backgroundQuad.anchor.set(1, -1, 0);
                cursorQuad.anchor.set(1, 0, 0);

                // Set the child hierarchy
                entity.addChild(quadEntity);
                entity.addChild(labelEntity);
                entity.addChild(cursorEntity);

                // Tag entities to make them more easily accessible later
                entity.tagEntity(labelEntity);
                entity.tagEntity(quadEntity);
                entity.tagEntity(cursorEntity);

                return entity;
            }
        });

        return UIInputFactory;
    }
);
