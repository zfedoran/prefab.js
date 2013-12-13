define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/boundingBox',
        'graphics/vertexDeclaration',
        'graphics/vertexElement',
        'graphics/mesh'
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        BoundingBox,
        VertexDeclaration,
        VertexElement,
        Mesh
    ) {
        'use strict';

        var MeshFactory = function(device) {
            this.device = device;

            this.indices   = [];
            this.vertices  = [];
            this.colors    = [];
            this.normals   = [];
            this.tangents  = [];
            this.uv0       = [];
            this.uv1       = [];

            this._vertexCount = 0;
            this._indexCount = 0;

            this.hasBegun = false;
        };

        MeshFactory.prototype = {
            constructor: MeshFactory,

            getVertexCount: function() {
                return this._vertexCount;
            },

            addVertex: function(v) {
                if (!this.hasBegun) { throw 'MeshFactory: begin() must be called before addVertex()'; }

                this.vertices.push(v);
                this._vertexCount++;
            },

            addColor: function(v) {
                if (!this.hasBegun) { throw 'MeshFactory: begin() must be called before addColor()'; }

                this.colors.push(v);
            },

            addNormal: function(v) {
                if (!this.hasBegun) { throw 'MeshFactory: begin() must be called before addNormal()'; }

                this.normals.push(v);
            },

            addUVtoLayer0: function(v) {
                if (!this.hasBegun) { throw 'MeshFactory: begin() must be called before addUVtoLayer0()'; }

                this.uv0.push(v);
            },

            addUVtoLayer1: function(v) {
                if (!this.hasBegun) { throw 'MeshFactory: begin() must be called before addUVtoLayer1()'; }

                this.uv1.push(v);
            },

            addTriangle: function(a, b, c) {
                if (!this.hasBegun) { throw 'MeshFactory: begin() must be called before addTriangle()'; }

                this.indices.push(a);
                this.indices.push(b);
                this.indices.push(c);
                this._indexCount+=3;
            },

            addLine: function(a, b) {
                if (!this.hasBegun) { throw 'MeshFactory: begin() must be called before addLine()'; }

                this.indices.push(a);
                this.indices.push(b);
                this._indexCount+=2;
            },

            begin: function(mesh) {
                if (this.hasBegun) {
                    throw 'MeshFactory: end() must be called before begin() can be called again';
                }

                if (typeof mesh === 'undefined') {
                    throw 'MeshFactory: mesh is undefined';
                }

                this.mesh = mesh;

                this.indices.length = 0;
                this.vertices.length = 0;
                this.colors.length = 0;
                this.normals.length = 0;
                this.tangents.length = 0;
                this.uv0.length = 0;
                this.uv1.length = 0;

                this._vertexCount = 0;
                this._indexCount = 0;

                this.hasBegun = true;
            },

            end: function() {
                if (!this.hasBegun) {
                    throw 'MeshFactory: begin() must be called end()';
                }

                var vertexDeclaration = new VertexDeclaration();

                var element, offset, vertexDataSet = [];
                var numVertices = 0;

                if (this.vertices.length > 0) {
                    offset = vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector3, 'aVertexPosition');
                    vertexDeclaration.push(element);
                    vertexDataSet.push(this.vertices);
                    if (numVertices > 0 && numVertices !== this.vertices.length) {
                        throw 'Mesh: unexpected number of vertices';
                    }
                    numVertices = this.vertices.length;
                }
                if (this.colors.length > 0) {
                    offset = vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector4, 'aVertexColor');
                    vertexDeclaration.push(element);
                    vertexDataSet.push(this.colors);
                    if (numVertices > 0 && numVertices !== this.colors.length) {
                        throw 'Mesh: unexpected number of colors';
                    }
                    numVertices = this.colors.length;
                }
                if (this.normals.length > 0) {
                    offset = vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector3, 'aVertexNormal');
                    vertexDeclaration.push(element);
                    vertexDataSet.push(this.normals);
                    if (numVertices > 0 && numVertices !== this.normals.length) {
                        throw 'Mesh: unexpected number of normals';
                    }
                    numVertices = this.normals.length;
                }
                if (this.tangents.length > 0) {
                    offset = vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector3, 'aVertexTangent');
                    vertexDeclaration.push(element);
                    vertexDataSet.push(this.tangents);
                    if (numVertices > 0 && numVertices !== this.tangents.length) {
                        throw 'Mesh: unexpected number of tangents';
                    }
                    numVertices = this.tangents.length;
                }
                if (this.uv0.length > 0) {
                    offset = vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector2, 'aVertexUV0');
                    vertexDeclaration.push(element);
                    vertexDataSet.push(this.uv0);
                    if (numVertices > 0 && numVertices !== this.uv0.length) {
                        throw 'Mesh: unexpected number of uv0';
                    }
                    numVertices = this.uv0.length;
                }
                if (this.uv1.length > 0) {
                    offset = vertexDeclaration.getCurrentOffset();
                    element = new VertexElement(offset * 4, VertexElement.Vector2, 'aVertexUV1');
                    vertexDeclaration.push(element);
                    vertexDataSet.push(this.uv1);
                    if (numVertices > 0 && numVertices !== this.uv1.length) {
                        throw 'Mesh: unexpected number of uv1';
                    }
                    numVertices = this.uv1.length;
                }

                var indexData = new Uint16Array(this.indices);
                var vertexData = new Float32Array(vertexDeclaration.getCurrentOffset() * numVertices);

                var i, j, v, index = 0, numSets = vertexDataSet.length;
                for (i = 0; i < numVertices; i++) {
                    for (j = 0; j < numSets; j ++) {
                        v = vertexDataSet[j][i];
                        if (v instanceof Vector2) {
                            vertexData[index++] = v.x;
                            vertexData[index++] = v.y;
                        } else if (v instanceof Vector3) {
                            vertexData[index++] = v.x;
                            vertexData[index++] = v.y;
                            vertexData[index++] = v.z;
                        } else if (v instanceof Vector4) {
                            vertexData[index++] = v.x;
                            vertexData[index++] = v.y;
                            vertexData[index++] = v.z;
                            vertexData[index++] = v.w;
                        } else {
                            throw 'Mesh: encountered unexpected data type during mesh data merge';
                        }
                    }
                }

                this.mesh.setVertexDeclaration(vertexDeclaration);
                this.mesh.setVertexData(vertexData);
                this.mesh.setIndexData(indexData);

                this.mesh = null;
                this.hasBegun = false;
            }
        };

        return MeshFactory;
    }
);
