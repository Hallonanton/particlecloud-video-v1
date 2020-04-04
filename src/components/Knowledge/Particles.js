import * as THREE from 'three';
import { TweenLite } from 'gsap';
import TouchTexture from './Interactive/TouchTexture';

const glslify = require("glslify");


export default class Particles {
  
  constructor(webgl) {
    this.webgl = webgl;
    this.container = new THREE.Object3D();
  }

  init( videoSrc ) {

    // Create a video element to read data from 
    this.video = document.createElement('video');
    this.video.autoplay = true
    this.video.loop = true
    this.video.src = videoSrc

    // Extract data after load
    this.video.addEventListener('loadeddata', e => {
      
      var texture = new THREE.VideoTexture( this.video );

      this.width = this.video.videoWidth
      this.height = this.video.videoHeight

      this.texture = texture;
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.magFilter = THREE.LinearFilter;
      this.texture.format = THREE.RGBFormat;

      // Initiate animation
      this.initPoints();
      this.initHitArea();
      this.initTouch();
      this.resize();
      this.show();
    })
  }

  initPoints() {

    // Uniforms for shaders
    /* variables that the shaders use to calculate position/color */
    const uniforms = {
      uColor: { value: new THREE.Color(0x8e44ad) },
      uDepth: { value: 1.0 }, // Set from this.show()
      uSize: { value: 1.0 },  // Set from this.show()
      uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
      uTexture: { value: this.texture },
      uTouch: { value: null },
    };

    // Create material
    const material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: glslify(require("./Shaders/particle.vert")),
      fragmentShader: glslify(require("./Shaders/particle.frag")),
      depthTest: false,
      transparent: true,
    });

    const geometry = new THREE.InstancedBufferGeometry();

    // Positions
    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5,  0.5,  0.0);
    positions.setXYZ(1,  0.5,  0.5,  0.0);
    positions.setXYZ(2, -0.5, -0.5,  0.0);
    positions.setXYZ(3,  0.5, -0.5,  0.0);
    geometry.setAttribute('position', positions);

    // UVs
    /* UV mapping is the 3D modelling process of projecting a 2D image to a 3D model's surface for texture mapping. */
    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXYZ(0,  0.0,  0.0);
    uvs.setXYZ(1,  1.0,  0.0);
    uvs.setXYZ(2,  0.0,  1.0);
    uvs.setXYZ(3,  1.0,  1.0);
    geometry.setAttribute('uv', uvs);

    // Index
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1));

    // Calcluate pixels
    let numPoints = this.width * this.height;

    //Remove one row and one column
    let numVisible = numPoints / 2 / 2;

    // Pixel grid
    const indices = new Uint16Array(numVisible);
    const offsets = new Float32Array(numVisible * 3);
    const angles = new Float32Array(numVisible);

    for (let i = 0; i <= numVisible; i++) {

      const j = i*2
      const offsetX = j % this.width
      const offsetY = Math.floor(j / this.width) * 2

      offsets[i * 3 + 0] = offsetX;
      offsets[i * 3 + 1] = offsetY;

      indices[i] = i;

      angles[i] = Math.random() * Math.PI;
    }

    geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
    geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));

    // Create object that will be visible in the render
    this.object3D = new THREE.Mesh(geometry, material);
    this.container.add(this.object3D);
  }

  initTouch() {
    // Create only once
    if (!this.touch) this.touch = new TouchTexture(this);
    this.object3D.material.uniforms.uTouch.value = this.touch.texture;
  }

  initHitArea() {
    const geometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, depthTest: false });
    material.visible = false;
    this.hitArea = new THREE.Mesh(geometry, material);
    this.container.add(this.hitArea);
  }

  addListeners() {
    this.handlerInteractiveMove = this.onInteractiveMove.bind(this);

    this.webgl.interactive.addListener('interactive-move', this.handlerInteractiveMove);
    this.webgl.interactive.objects.push(this.hitArea);
    this.webgl.interactive.enable();
  }

  removeListeners() {
    this.webgl.interactive.removeListener('interactive-move', this.handlerInteractiveMove);
    
    const index = this.webgl.interactive.objects.findIndex(obj => obj === this.hitArea);
    this.webgl.interactive.objects.splice(index, 1);
    this.webgl.interactive.disable();

    if ( this.video ) this.video.pause();
  }

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update() {
    if (!this.object3D) return;
    if (this.touch) this.touch.update();
  }

  show(time = 2.0) {
    if (!this.object3D) return;
    // reset
    TweenLite.fromTo(this.object3D.material.uniforms.uSize, time, { value: 0 }, { value: 1.0 });
    TweenLite.fromTo(this.object3D.material.uniforms.uDepth, time * 1.5, { value: 20.0 }, { value: 1.0 });

    this.addListeners();
  }

  hide(time = 1.6) {
    if (!this.object3D) return;
    return new Promise((resolve, reject) => {
      TweenLite.to(this.object3D.material.uniforms.uSize, time, { value: 0.0 });

      this.removeListeners();
    });
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------

  resize() {
    if (!this.object3D) return;

    const scale = (this.webgl.fovHeight / this.height) * 0.75;
    this.object3D.scale.set(scale, scale, 1);
    this.hitArea.scale.set(scale, scale, 1);
  }

  onInteractiveMove(e) {
    const uv = e.intersectionData.uv;
    if (this.touch) this.touch.addTouch(uv);
  }
}
