define([
    ],
    function(
    ) {
        'use strict';

        var ShaderAttribute = function(program, name, type, index) {
            this.program = program;
            this.name = name;
            this.type = type;
            this.index = index;
        };

        ShaderAttribute.prototype = {
            constructor: ShaderAttribute,
        };

        return ShaderAttribute;
    }
);
