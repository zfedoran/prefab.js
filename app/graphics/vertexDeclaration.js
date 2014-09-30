define([
        'graphics/vertexElement'
    ],
    function(
        VertexElement
    ) {
        'use strict';

        var VertexDeclaration = function(elements) {
            this.elements      = elements || [];
            this.length        = this.elements.length;
            this.strideInBytes = 0;
            this.stride        = 0;

            var i;
            for (i = 0; i < this.elements.length; i++) {
                this.strideInBytes += this.elements[i].size;
                this.stride        += this.elements[i].numElem;
            }
        };

        VertexDeclaration.prototype = {
            constructor: VertexDeclaration,

            push: function(element) {
                this.elements.push(element);
                this.strideInBytes += element.size;
                this.stride        += element.numElem;
                this.length++;
            },

            getCurrentOffset: function() {
                return this.stride;
            }
        };

        return VertexDeclaration;
    }
);
