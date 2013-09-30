attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying lowp vec3 vLighting;
varying lowp vec2 vTextureCoord;

void main(void) {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);

    // Apply lighting effect
    highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);
    highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
    highp vec3 directionalVector = vec3(1.0, 0, 0);
    highp vec4 transformedNormal = uNMatrix * vec4(aVertexNormal, 1.0);
   
    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
    vTextureCoord = aTextureCoord;
}

