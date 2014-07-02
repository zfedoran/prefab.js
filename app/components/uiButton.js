define([
        'lodash',
        'components/uiElement',
        'math/vector4'
    ],
    function(
        _,
        UIElement,
        Vector4
    ) {
        'use strict';

        /**
        *   UIButton component class.
        *
        *   @class 
        *   @constructor
        */
        var UIButton = function(text, uiStyle) {
            UIElement.call(this, uiStyle);

            this.text = text;
        };

        UIButton.__name__ = 'UIButton';

        UIButton.prototype = _.create(UIElement.prototype, {
            constructor: UIButton,
        });

        return UIButton;
    }
);
