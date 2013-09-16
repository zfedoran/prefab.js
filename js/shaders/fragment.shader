varying lowp vec4 vColor;
varying lowp vec3 vLighting;

void main(void) {
    gl_FragColor = vec4(vColor.xyz * vLighting, vColor.a);
}
