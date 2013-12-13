attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform lowp vec4 diffuse;
varying lowp vec4 vColor;

void main(void) {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor * diffuse;
    vColor = aVertexColor;
}

