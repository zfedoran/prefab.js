define([
        'graphics/device'
    ],
    function(
        GraphicsDevice
    ) {

        var PrimitiveBatch = function(device) {
            this.device = device;
            this.vertexBuffer = this.device.createBuffer();
            this.vertices = new Float32Array(1024);
        };

        PrimitiveBatch.prototype = {
            constructor: PrimitiveBatch,
            begin: function(primitiveType, stride) {
                if (this.hasBegun) {
                    throw 'PrimitiveBatch: end() must be called before begin() can be called again';
                }

                if (typeof stride === 'undefined') {
                    throw 'PrimitiveBatch: no stride length specified';
                }

                if (primitiveType === GraphicsDevice.POINTS) {
                    this.numVertsPerPrimitive = 1;
                } else if (primitiveType === GraphicsDevice.LINES) {
                    this.numVertsPerPrimitive = 2;
                } else if (primitiveType === GraphicsDevice.TRIANGLES) {
                    this.numVertsPerPrimitive = 3;
                } else {
                    throw 'PrimitiveBatch: primitive type not supported';
                }

                this.primitiveType = primitiveType;
                this.stride = stride;
                this.positionInBuffer = 0;
                this.hasBegun = true;
            },
            end: function() {
                if (this.positionInBuffer !== 0) {
                    this.flush();
                }
                this.hasBegun = false;
            },
            flush: function() {
                if (this.positionInBuffer === 0) {
                    throw 'PrimitiveBatch: flush called on 0 elements';
                }

                this.device.bindVertexBuffer(this.vertexBuffer);
                this.device.setVertexBufferData(this.vertexBuffer, this.vertices);
                this.device.drawPrimitives(this.primitiveType, this.positionInBuffer, 0);
                this.positionInBuffer = 0;
            },
            addVertex: function(vertexData) {
                if (!this.hasBegun) {
                    throw 'PrimitiveBatch: begin() must be called before addVertex()';
                }

                if (this.stride !== vertexData.length) {
                    throw 'PrimitiveBatch: cannot add a vertex, stride length does not match begin()';
                }

                // If this is a new primitive, and we do NOT have room for it, flush
                if ((this.positionInBuffer % this.numVertsPerPrimitive) === 0 &&
                    (this.positionInBuffer + this.numVertsPerPrimitive) * this.stride >= this.vertices.length) {
                    this.flush();
                }

                var i = 0;
                for (i; i<vertexData.length; i++) {
                    this.vertices[(this.positionInBuffer * this.stride) + i] = vertexData[i];
                }

                this.positionInBuffer++;
            }
        };

        return PrimitiveBatch;
    }
);
