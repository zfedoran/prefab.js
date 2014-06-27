varying lowp vec2 vTextureCoord;

uniform lowp vec4 diffuse;
uniform sampler2D diffuseMap;
uniform lowp float ambientFactor;

void main(void) {
    lowp vec4 textureColor = texture2D(diffuseMap, vTextureCoord);

    if (textureColor.rgb == vec3(0, 0, 0)) {
        discard;
    } else {
        gl_FragColor = vec4(diffuse.rgb, textureColor.r * ambientFactor);
    }
}
