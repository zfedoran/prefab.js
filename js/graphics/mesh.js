define([
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'math/boundingBox',
        'graphics/device',
        'graphics/vertexDeclaration',
        'graphics/vertexElement'
    ],
    function(
        Vector2,
        Vector3,
        Vector4,
        BoundingBox,
        GraphicsDevice,
        VertexDeclaration,
        VertexElement
    ) {
        'use strict';

        var Mesh = function(device) {
            if (!(device instanceof GraphicsDevice)) {
                throw 'Mesh: cannot create a mesh without a graphics device';
            }

            this.device = device;

            this.vertexDeclaration = null;
            this.indexData    = null;
            this.vertexData   = null;

            this.vertexBuffer = this.device.createBuffer();
            this.indexBuffer = this.device.createBuffer();

            this.boundingBox = new BoundingBox();
            this.boundingBoxComputed = false;
            this.setDirty(true);
        };

        Mesh.prototype = {
            constructor: Mesh,

            isDirty: function() { 
                return this._dirty;
            },

            setDirty: function(value) {
                this._dirty = value;
            },

            setVertexData: function(vertexData) {
                this.vertexData = vertexData;
            },

            setIndexData: function(indexData) {
                this.indexData = indexData;
            },

            setVertexDeclaration: function(vertexDeclaration) {
                this.vertexDeclaration = vertexDeclaration;
            },

            sendToGPU: function() {
                this.device.setVertexBufferData(this.vertexBuffer, this.vertexData);
                this.device.setIndexBufferData(this.indexBuffer, this.indexData);
                this.setDirty(false);
            },

            draw: function() {
                if (this.isDirty(true)) {
                    this.sendToGPU();
                }

                this.device.bindVertexDeclaration(this.vertexDeclaration);
                this.device.bindVertexBuffer(this.vertexBuffer);
                this.device.bindIndexBuffer(this.indexBuffer);
                this.device.drawIndexedPrimitives(GraphicsDevice.TRIANGLES, this.indexBuffer.length, GraphicsDevice.UNSIGNED_SHORT, 0);
            },

            destroy: function() {
                delete this.vertexData;
                delete this.indexData;
                this.device.deleteBuffer(this.vertexBuffer);
                this.device.deleteBuffer(this.indexBuffer);
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
