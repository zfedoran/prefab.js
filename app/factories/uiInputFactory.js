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

                labelEntity.name = 'foreground';
                quadEntity.name  = 'background';

                var label = labelEntity.getComponent('Label');
                var quad  = quadEntity.getComponent('Quad');

                quad.useSlicedMode();
                
                label.anchor.set(1, -1, 0);
                quad.anchor.set(1, -1, 0);

                entity.addChild(quadEntity);
                entity.addChild(labelEntity);

                var uiInput = entity.getComponent('UIInput');
                entity.on('mouseenter mouseleave mousedown mouseup', function(event) {
                    uiInput.handleState(event);
                    if (uiInput.isDirty()) {
                        var uiStyle = uiInput.getCurrentStyle();
                        quad.setSprite(uiStyle.background);
                        quadEntity.getComponent('MeshRenderer').material.diffuseMap = uiStyle.background;
                        labelEntity.getComponent('MeshRenderer').material.diffuse   = uiStyle.fontColor;
                    }
                }, this);

                return entity;
            }
        });

        return UIInputFactory;
    }
);
