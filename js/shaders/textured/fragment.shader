varying lowp vec2 vTextureCoord;

uniform lowp vec4 diffuse;
uniform sampler2D diffuseMap;

void main(void) {
    gl_FragColor = texture2D(diffuseMap, vTextureCoord) * diffuse;
}
