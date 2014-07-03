define([
        'lodash',
        'core/factory',
        'factories/labelFactory',
        'factories/quadFactory',
        'components/transform',
        'components/uiElement',
        'components/uiButton',
        'components/boxCollider'
    ],
    function(
        _,
        Factory,
        LabelFactory,
        QuadFactory,
        Transform,
        UIElement,
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

            create: function(text, uiElementStyle) {
                var entity = this.context.createNewEntity('button-' + _count++);

                // UIButton component
                entity.addComponent(new Transform());
                entity.addComponent(new UIButton(text, uiElementStyle));
                entity.addComponent(new BoxCollider());

                // Child Entities
                var defaultStyle = entity.getComponent('UIButton').getCurrentStyle();
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

                var uiButton = entity.getComponent('UIButton');
                entity.on('mouseenter mouseleave mousedown mouseup', function(event) {
                    uiButton.handleState(event);
                    if (uiButton.isDirty()) {
                        var uiStyle = uiButton.getCurrentStyle();
                        quad.setSprite(uiStyle.background);
                        quadEntity.getComponent('MeshRenderer').material.diffuseMap = uiStyle.background;
                        labelEntity.getComponent('MeshRenderer').material.diffuse   = uiStyle.fontColor;
                    }
                }, this);

                return entity;
            }
        });

        return UIButtonFactory;
    }
);
