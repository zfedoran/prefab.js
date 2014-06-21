varying lowp vec2 vTextureCoord;

uniform lowp vec4 diffuse;
uniform sampler2D diffuseMap;

void main(void) {
    lowp vec4 textureColor = texture2D(diffuseMap, vTextureCoord);

    if (textureColor.r < 0.1) {
        discard;
    } else {
        gl_FragColor = vec4(textureColor.rgb, textureColor.r);
    }
}
