import * as THREE from 'three';
import InteractiveControls from './Interactive/InteractiveControls';
import Particles from './Particles';

export default class WebGLView {

	constructor(app, videoSrc) {
		this.app = app;

		this.initThree();
		this.initParticles(videoSrc);
		this.initControls();
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.set(
      0,
      0, 
      300
    )
		this.camera.lookAt(0, 0, 0);

		// renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	}

	initControls() {
		this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
	}

	initParticles(videoSrc) {
		this.particles = new Particles(this);
		this.scene.add(this.particles.container);
		this.particles.init(videoSrc);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (this.particles) this.particles.update();
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.renderer) return;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		if (this.interactive) this.interactive.resize();
		if (this.particles) this.particles.resize();
	}
}
