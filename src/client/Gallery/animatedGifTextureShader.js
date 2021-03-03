// This shader is used to blit every new Gif Frames on top of the previous one
// As the patch is not of the same size and position than our original Gif,
// We need a simple way to offset the data localtion.
var vertexShader = "\n// Attributes\nattribute vec2 position;\n\n// Transform matrix to offset the patch\nuniform mat3 world;\n\n// Output\nvarying vec2 vUV;\n\nvoid main(void) {\n    // We chose position from 0 to 1 to simplify to matrix computation\n    // So the UVs will be a straight match\n    vUV = position;\n\n    // Transform to the requested patch location\n    vec3 wPosition = vec3(position, 1) * world;\n\n    // Go back from 0 to 1 to -1 to 1 for clip space coordinates\n    wPosition = wPosition * 2.0 - 1.0;\n\n    // Assign the location (depth is disabled in the pipeline)\n    gl_Position = vec4(wPosition.xy, 0.0, 1.0);\n}";
var fragmentShader = "\n// Inputs from vertex\nvarying vec2 vUV;\n\n// Color Lookup\nuniform sampler2D textureSampler;\n\nvoid main(void) \n{\n    // We simply display the color from the texture\n    vec2 uv = vec2(vUV.x, 1.0 - vUV.y);\n    vec4 finalColor = texture2D(textureSampler, vUV);\n\n    // With a pinch of alpha testing as defined in the data\n    // Else everything could have been handled in a texSubImage2d.\n    if (finalColor.a == 0.) {\n        discard;\n    }\n\n    gl_FragColor = finalColor;\n}";
/**
 * Defines all the data required for our effect
 */
export var AnimatedGifShaderConfiguration = {
    name: "Patch",
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    samplerNames: ["textureSampler"],
    uniformNames: ["world"],
};
//# sourceMappingURL=animatedGifTextureShader.js.map