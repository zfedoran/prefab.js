define([
        'graphics/vertexElement'
    ],
    function(
        VertexElement
    ) {

        var VertexDeclaration = function(elements) {
            this.elements = elements || [];
            this.length = elements.length;
            this.stride = 0;
            this._currentOffset = 0;

            var i;
            for (i = 0; i < elements.length; i++) {
                this.stride += elements[i].size;
                this._currentOffset += elements[i].numElem;
            }
        };

        VertexDeclaration.prototype = {
            constructor: VertexDeclaration,
            push: function(element) {
                this.elements.push(element);
                this.stride += element.size;
                this._currentOffset += element.numElem;
                this.length++;
            },
            getCurrentOffset: function() {
                return this._currentOffset;
            }
        };

        return VertexDeclaration;
    }
);
