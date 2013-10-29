define([
    ],
    function(
    ) {
        
        var ShaderGenerator = function() {
        
        };
        
        ShaderGenerator.prototype = {
            // Precision
            prefixPrecision: [
                'precision highp float;',
                'precision highp int;'
            ].join('\n'),

            //-----------------------------------------------------------------

            // Common Attributes
            attributePosition: [
                'attribute vec3 aPosition;'
            ].join('\n'),

            attributeNormal: [ 
                'attribute vec3 aNormal;'
            ].join('\n'),

            attributeUV0: [ 
                'attribute vec2 aUV0;'
            ].join('\n'),

            attributeUV1: [ 
                'attribute vec2 aUV1;'
            ].join('\n'),

            attributeColor: [ 
                'attribute vec4 aColor;'
            ].join('\n'),

            //-----------------------------------------------------------------

            // Common Uniforms
            uniformTransforms: [ 
                'uniform mat4 uMMatrix;',
                'uniform mat4 uVMatrix;',
                'uniform mat4 uPMatrix;',
                'uniform mat4 uMVMatrix;',
                'uniform mat3 uNMatrix;'
            ].join('\n'),

            uniformCameraPosition: [ 
                'uniform vec3 uCameraPosition;'
            ].join('\n'),

            //-----------------------------------------------------------------

            // Fog Uniforms
            uniformFog: [
                'uniform float uFogDensity;',
                'uniform float uFogNear;',
                'uniform float uFogFar;',
                'uniform vec4 uFogColor;'
            ].join('\n'),

            //-----------------------------------------------------------------

            // Light Uniforms
            uniformAmbientLight: [
                'uniform vec3 uAmbient;',
                'uniform vec3 uDiffuse;',
                'uniform vec3 uEmissive;',
                'uniform vec3 uAmbientLightColor;',
            ].join('\n'),

            uniformDirectionalLight: [
                'uniform vec3 uDirectionalLightColor[ MAX_DIR_LIGHTS ];',
                'uniform vec3 uDirectionalLightDirection[ MAX_DIR_LIGHTS ];'
            ].join('\n'),

            uniformHemiLight: [
                'uniform vec3 uHemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];',
                'uniform vec3 uHemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];',
                'uniform vec3 uHemisphereLightDirection[ MAX_HEMI_LIGHTS ];'
            ].join('\n'),

            uniformPointLight: [
                'uniform vec3  uPointLightColor[ MAX_POINT_LIGHTS ];',
                'uniform vec3  uPointLightPosition[ MAX_POINT_LIGHTS ];',
                'uniform float uPointLightDistance[ MAX_POINT_LIGHTS ];'
            ].join('\n'),

            uniformSpotLight: [
                'uniform vec3  uSpotLightColor[ MAX_SPOT_LIGHTS ];',
                'uniform vec3  uSpotLightPosition[ MAX_SPOT_LIGHTS ];',
                'uniform vec3  uSpotLightDirection[ MAX_SPOT_LIGHTS ];',
                'uniform float uSpotLightDistance[ MAX_SPOT_LIGHTS ];',
                'uniform float uSpotLightAngleCos[ MAX_SPOT_LIGHTS ];',
                'uniform float uSpotLightExponent[ MAX_SPOT_LIGHTS ];'
            ].join('\n'),

            //-----------------------------------------------------------------

            // Shadow Uniforms
            uniformShadowMap: [
                'uniform sampler2D uShadowMap[ MAX_SHADOWS ];',
                'uniform vec2      uShadowMapSize[ MAX_SHADOWS ];',
                'uniform float     uShadowDarkness[ MAX_SHADOWS ];',
                'uniform float     uShadowBias[ MAX_SHADOWS ];'
            ].join('\n'),

            //-----------------------------------------------------------------

            // Texture Uniforms
            uniformTextureMapOffsetRepeat: [
                "uniform vec4 uOffsetRepeat;",
            ].join('\n'),

            uniformTextureMap: [
                "uniform sampler2D uTextureMap;",
            ].join('\n'),

            uniformNormalMap: [
                "uniform sampler2D uNormalMap;",
                'uniform vec2 uNormalScale;'
            ].join('\n'),

            uniformLightMap: [
                "uniform sampler2D uLightMap;",
            ].join('\n'),

            uniformSpecularMap: [
                "uniform sampler2D uSpecularMap;",
            ].join('\n'),

            //-----------------------------------------------------------------

            // Common Varying
            varyingLightFront: [
                'varying vec3 vLightFront;'
            ].join('\n'),

            varyingLightBack: [
                'varying vec3 vLightBack;'
            ].join('\n'),

            varyingColor: [
                'varying vec3 vColor;'
            ].join('\n'),

            varyingUV0: [
                "varying vec2 vUV0;"
            ].join('\n'),

            varyingUV1: [
                "varying vec2 vUV1;"
            ].join('\n'),

            varyingShadowCoord: [
                "varying vec4 vShadowCoord[ MAX_SHADOWS ];",
            ].join('\n'),

            //-----------------------------------------------------------------

            // Vertex Shader Chunks
            calcVaryingUV0: [
                "vUV0 = aUV0 * uOffsetRepeat.zw + uOffsetRepeat.xy;"
            ].join('\n'),

            calcVaryingUV1: [
                "vUV1 = aUV1;"
            ].join('\n'),

            calcVaryingColor: [
                "vColor = aColor;"
            ].join('\n'),

            calcTransformedNormal: [
                "vec3 transformedNormal = uNMatrix * aNormal;"
            ].join('\n'),

            calcScreenPosition: [
                "gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);"
            ].join('\n'),

            calcWorldPosition: [
                "vec4 worldPosition = uMMatrix * vec4(aPosition, 1.0 );",
            ].join('\n'),


        };

        return ShaderGenerator;
    }
);
