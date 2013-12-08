varying lowp vec3 vLighting;
varying lowp vec2 vTextureCoord;

uniform sampler2D diffuseMap;

void main(void) {
    gl_FragColor = vec4(texture2D(diffuseMap, vTextureCoord).xyz * vLighting, 1);
    gl_FragColor = texture2D(diffuseMap, vTextureCoord);
    //gl_FragColor = vec4(vColor.xyz * vLighting, vColor.a);
}
