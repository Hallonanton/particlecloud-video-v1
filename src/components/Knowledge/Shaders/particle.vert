precision highp float;
attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;
attribute float angle;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform sampler2D uTouch;
varying vec2 vPUv;
varying vec2 vUv;

#pragma glslify: snoise = require(glsl-noise/simplex/2d)

float random(float n) {
    return fract(sin(n) * 43758.5453123);
}

void main() {
    vUv = uv;

    // particle uv
    vec2 puv = offset.xy / uTextureSize;
    vPUv = puv;

    // randomise
    float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.1)));

    // displacement
    vec3 displaced = offset;
    //Center
    displaced.xy -= uTextureSize * 0.5 + (rndz * (uDepth - 1.0));
    displaced.z = rndz * (uDepth - 1.0);

    // touch
    float t = texture2D(uTouch, puv).r;
    displaced.z += t * 20.0 * rndz;
    displaced.x += cos(angle) * t * 20.0 * rndz;
    displaced.y += sin(angle) * t * 20.0 * rndz;

    // pixel color
    vec4 colA = texture2D(uTexture, puv);
    float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

    // particle size
    float psize = uSize;
    psize *= max(grey*3.0, 0.5);

    // final position
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    mvPosition.xyz += position * psize;
    vec4 finalPosition = projectionMatrix * mvPosition;

    gl_Position = finalPosition;
}