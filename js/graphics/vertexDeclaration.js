define([
        'graphics/vertexElement'
    ],
    function(
        VertexElement
    ) {

        var VertexDeclaration = function() {
            this.elements = arguments;
            this.length = arguments.length;
            this.stride = 0;

            var i;
            for (i = 0; i < arguments.length; i++) {
                this.stride += arguments[i].size;
            }
        };

        VertexDeclaration.prototype = {
            constructor: VertexDeclaration
        };

        return VertexDeclaration;
    }
);
