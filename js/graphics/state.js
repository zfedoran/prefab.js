define([
    ],
    function(
    ) {

        var DeviceState = function(context) {
            // Private variables
            var _context = context;

            var _vertexBuffer = null;
            var _indexBuffer = null;
            var _vertexDeclaration = null;
            var _shader = null;

            var _blendState = null;
            var _depthStencilState = null;
            var _rasterizerState = null;
            var _samplerState = null;

            // Public getters/setters
            this.setContext = function(ref) { _context = ref; };
            this.getContext = function() { return _context; };

            this.setVertexBuffer = function(ref) { _vertexBuffer = ref; };
            this.getVertexBuffer = function() { return _vertexBuffer; };

            this.setIndexBuffer = function(ref) { _indexBuffer = ref; };
            this.getIndexBuffer = function() { return _indexBuffer; };

            this.setVertexDeclaration = function(ref) { _vertexDeclaration = ref; };
            this.getVertexDeclaration = function() { return _vertexDeclaration; };

            this.setShader = function(ref) { _shader = ref; };
            this.getShader = function() { return _shader; };

            this.setBlendState = function(ref) { _blendState = ref; };
            this.getBlendState = function(ref) { return _blendState; };

            this.setDepthStencilState = function(ref) { _depthStencilState = ref; };
            this.getDepthStencilState = function(ref) { return _depthStencilState; };

            this.setRasterizerState = function(ref) { _rasterizerState = ref; };
            this.getRasterizerState = function(ref) { return _rasterizerState; };

            this.setSamplerState = function(ref) { _samplerState = ref; };
            this.getSamplerState = function(ref) { return _samplerState; };

        };

        return DeviceState;
    }
);
