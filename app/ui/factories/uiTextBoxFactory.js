define([
        'lodash',
        'core/factory',
        'factories/quadFactory',
        'components/transform',
        'components/boxCollider',
        'ui/factories/uiTextFactory',
        'ui/components/uiElement',
        'ui/components/uiTextBox'
    ],
    function(
        _,
        Factory,
        QuadFactory,
        Transform,
        BoxCollider,
        UITextFactory,
        UIElement,
        UITextBox
    ) {
        'use strict';
    
        var _count = 0;

        var UITextBoxFactory = function(context) {
            Factory.call(this, context);

            this.uiTextFactory = new UITextFactory(context);
            this.quadFactory   = new QuadFactory(context);
        };

        UITextBoxFactory.prototype = _.create(Factory.prototype, {
            construct: UITextBoxFactory,

            create: function(text, uiElementStyle) {
                var entity = this.context.createNewEntity('input-' + _count++);

                // UITextBox component
                entity.addComponent(new Transform());
                entity.addComponent(new UITextBox(text, uiElementStyle));
                entity.addComponent(new BoxCollider());

                // Child Entities
                var defaultStyle   = entity.getComponent('UITextBox').getCurrentStyle();
                var uiTextEntity   = this.uiTextFactory.create(text, defaultStyle.fontFamily, defaultStyle.fontSize);
                var quadEntity     = this.quadFactory.create(defaultStyle.background);
                var cursorEntity   = this.quadFactory.create(null, 1, defaultStyle.fontSize);

                uiTextEntity.name  = 'foreground';
                quadEntity.name    = 'background';
                cursorEntity.name  = 'cursor';

                var foregroundText = uiTextEntity.getComponent('UIText');
                var backgroundQuad = quadEntity.getComponent('Quad');
                var cursorQuad     = cursorEntity.getComponent('Quad');

                // Tell the background quad to slice up the sprite
                backgroundQuad.useSlicedMode();
                
                // Set anchor positions
                foregroundText.anchor.set(1, -1, 0);
                backgroundQuad.anchor.set(1, -1, 0);
                cursorQuad.anchor.set(1, 0, 0);

                // Set the child hierarchy
                entity.addChild(quadEntity);
                entity.addChild(uiTextEntity);
                entity.addChild(cursorEntity);

                // Tag entities to make them more easily accessible later
                entity.tagEntity(uiTextEntity);
                entity.tagEntity(quadEntity);
                entity.tagEntity(cursorEntity);

                return entity;
            }
        });

        return UITextBoxFactory;
    }
);
