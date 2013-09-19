define([
    ],
    function(
    ) {

        var VertexElement = function(offset, type, attributeLocation) {
            this.offset = offset;
            this.size = VertexElement.getSize(type);
            this.numElem = VertexElement.getLength(type);
            this.attributeLocation = attributeLocation;
        };

        VertexElement.prototype = {
            constructor: VertexElement,
        };

        VertexElement.getSize = function(type) {
            return sizeInBytes[type];
        };

        VertexElement.getLength = function(type) {
            return numberOfElements[type];
        };

        VertexElement.Vector2 = 2;
        VertexElement.Vector3 = 3;
        VertexElement.Vector4 = 4;
        VertexElement.Matrix4 = 16;

        var sizeInBytes = {};
        sizeInBytes[VertexElement.Vector2] = 2 * 4;
        sizeInBytes[VertexElement.Vector3] = 3 * 4;
        sizeInBytes[VertexElement.Vector4] = 4 * 4;
        sizeInBytes[VertexElement.Matrix4] = 16 * 4;

        var numberOfElements = {};
        numberOfElements[VertexElement.Vector2] = 2;
        numberOfElements[VertexElement.Vector3] = 3;
        numberOfElements[VertexElement.Vector4] = 4;
        numberOfElements[VertexElement.Matrix4] = 16;

        return VertexElement;
    }
);
