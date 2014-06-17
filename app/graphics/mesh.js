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

        var Mesh = function(device, primitiveType) {
            if (typeof device === 'undefined') {
                throw 'Mesh: cannot create a mesh without a graphics device';
            }
            if (typeof primitiveType === 'undefined') {
                throw 'Mesh: cannot create a mesh without a primitive type';
            }

            this.device              = device;
            this.primitiveType       = primitiveType;

            this.vertexDeclaration   = null;
            this.indexData           = null;
            this.vertexData          = null;

            this.vertexBuffer        = null;
            this.indexBuffer         = null;

            this.boundingBox         = new BoundingBox();
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

            setBoundingBox: function(boundingBox) {
                this.boundingBox = boundingBox;
            },

            getBoundingBox: function() {
                return this.boundingBox;
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
                this.device.drawIndexedPrimitives(this.primitiveType, this.indexBuffer.length, GraphicsDevice.UNSIGNED_SHORT, 0);
            },

            warm: function() {
                if (!this.vertexBuffer) {
                    this.vertexBuffer = this.device.createBuffer();
                    this.setDirty(true);
                }
                if (!this.indexBuffer) {
                    this.indexBuffer  = this.device.createBuffer();
                    this.setDirty(true);
                }
            },

            destroy: function() {
                this.device.deleteBuffer(this.vertexBuffer);
                this.device.deleteBuffer(this.indexBuffer);
                delete this.vertexBuffer;
                delete this.indexBuffer;
                delete this.vertexData;
                delete this.indexData;
                this.setDirty(true);
            }
        };

        /* PrimitiveType */
        Mesh.POINTS         = GraphicsDevice.POINTS;
        Mesh.LINES          = GraphicsDevice.LINES;
        Mesh.LINE_LOOP      = GraphicsDevice.LINE_LOOP;
        Mesh.LINE_STRIP     = GraphicsDevice.LINE_STRIP;
        Mesh.TRIANGLES      = GraphicsDevice.TRIANGLES;
        Mesh.TRIANGLE_STRIP = GraphicsDevice.TRIANGLE_STRIP;
        Mesh.TRIANGLE_FAN   = GraphicsDevice.TRIANGLE_FAN;

        return Mesh;
    }
);
