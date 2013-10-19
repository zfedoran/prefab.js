define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/boundingBox',
        'graphics/vertexDeclaration',
        'graphics/vertexElement'
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        BoundingBox,
        VertexDeclaration,
        VertexElement
    ) {
    
        var Mesh = function() {
            this.boundingBox = new BoundingBox();
            this.boundingBoxComputed = false;

            this._vertexCount = 0;
            this._indexCount = 0;
        };

        Mesh.prototype = {
            constructor: Mesh,

            getVertexCount: function() {
                return this._vertexCount;
            },

            addVertex: function(v) {
                if (typeof this.vertices === 'undefined') { this.vertices = []; }
                this.vertices.push(v);
                this._vertexCount++;
            },

            addNormal: function(v) {
                if (typeof this.normals === 'undefined') { this.normals = []; }
                this.normals.push(v);
            },

            addUVtoLayer0: function(v) {
                if (typeof this.uv0 === 'undefined') { this.uv0 = []; }
                this.uv0.push(v);
            },

            addUVtoLayer1: function(v) {
                if (typeof this.uv1 === 'undefined') { this.uv1 = []; }
                this.uv1.push(v);
            },

            addTriangle: function(a, b, c) {
                if (typeof this.indices === 'undefined') { this.indices = []; }
                this.indices.push(a);
                this.indices.push(b);
                this.indices.push(c);
            },

            apply: function(device) {
                this._vertexDeclaration = new VertexDeclaration();

                var element, offset, vertexDataSet = [];
                var numVertices = 0;

                if (typeof this.vertices !== 'undefined') {
                    offset = this._vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector3, 'aVertexPosition');
                    this._vertexDeclaration.push(element);
                    vertexDataSet.push(this.vertices);
                    if (numVertices > 0 && numVertices !== this.vertices.length) {
                        throw 'Mesh: unexpected number of vertices';
                    }
                    numVertices = this.vertices.length;
                }
                if (typeof this.normals !== 'undefined') {
                    offset = this._vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector3, 'aVertexNormal');
                    this._vertexDeclaration.push(element);
                    vertexDataSet.push(this.normals);
                    if (numVertices > 0 && numVertices !== this.normals.length) {
                        throw 'Mesh: unexpected number of normals';
                    }
                    numVertices = this.normals.length;
                }
                if (typeof this.tangents !== 'undefined') {
                    offset = this._vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector3, 'aVertexTangent');
                    this._vertexDeclaration.push(element);
                    vertexDataSet.push(this.tangents);
                    if (numVertices > 0 && numVertices !== this.tangents.length) {
                        throw 'Mesh: unexpected number of tangents';
                    }
                    numVertices = this.tangents.length;
                }
                if (typeof this.uv0 !== 'undefined') {
                    offset = this._vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector2, 'aVertexUV0');
                    this._vertexDeclaration.push(element);
                    vertexDataSet.push(this.uv0);
                    if (numVertices > 0 && numVertices !== this.uv0.length) {
                        throw 'Mesh: unexpected number of uv0';
                    }
                    numVertices = this.uv0.length;
                }
                if (typeof this.uv1 !== 'undefined') {
                    offset = this._vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector2, 'aVertexUV1');
                    this._vertexDeclaration.push(element);
                    vertexDataSet.push(this.uv1);
                    if (numVertices > 0 && numVertices !== this.uv1.length) {
                        throw 'Mesh: unexpected number of uv1';
                    }
                    numVertices = this.uv1.length;
                }

                this._indexData = new Uint16Array(this.indices);
                this._vertexData = new Float32Array(this._vertexDeclaration.getCurrentOffset() * numVertices);

                var i, j, v, index = 0, numSets = vertexDataSet.length;
                for (i = 0; i < numVertices; i++) {
                    for (j = 0; j < numSets; j ++) {
                        v = vertexDataSet[j][i];
                        if (v instanceof Vector2) {
                            this._vertexData[index++] = v.x;
                            this._vertexData[index++] = v.y;
                        } else if (v instanceof Vector3) {
                            this._vertexData[index++] = v.x;
                            this._vertexData[index++] = v.y;
                            this._vertexData[index++] = v.z;
                        } else if (v instanceof Vector4) {
                            this._vertexData[index++] = v.x;
                            this._vertexData[index++] = v.y;
                            this._vertexData[index++] = v.z;
                            this._vertexData[index++] = v.w;
                        } else {
                            throw 'Mesh: encountered unexpected data type during mesh data merge';
                        }
                    }
                }

                if (typeof this._vertexBuffer === 'undefined') {
                    this._vertexBuffer = device.createBuffer();
                }
                if (typeof this._indexBuffer === 'undefined') {
                    this._indexBuffer = device.createBuffer();
                }

                device.setVertexBufferData(this._vertexBuffer, this._vertexData);
                device.setIndexBufferData(this._indexBuffer, this._indexData);

                this.computeBoundingBox();
            },

            releaseNonGPUData: function() {
                delete this.vertices;
                delete this.normals;
                delete this.tangents;
                delete this.uv0;
                delete this.uv1;
                delete this.indices;
            },

            computeBoundingBox: function() {
                if (typeof this.vertices !== 'undefined') {
                    var i, len = this.vertices.length;
                    for (i = 0; i < len; i++) {
                        this.boundingBox.expandByVector3(this.vertices[i]);
                    }
                }
            }
        };

        return Mesh;
    }
);
