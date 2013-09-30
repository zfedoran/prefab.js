varying lowp vec3 vLighting;
varying lowp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = vec4(texture2D(uSampler, vTextureCoord).xyz * vLighting, 1);
    gl_FragColor = vec4(texture2D(uSampler, vTextureCoord).xyz, 1);
    //gl_FragColor = vec4(vColor.xyz * vLighting, vColor.a);
}
