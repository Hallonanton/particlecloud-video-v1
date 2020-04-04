import React, { Component } from 'react'
import WebGLHandler from './WebglHandler'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import VideoSrc from '../../img/test-face-150.mp4'


/*==============================================================================
  # Component
==============================================================================*/

class SectionKnowledge extends Component {

  componentDidMount() {
    this.useStats = false;
    this.initWebGL();
    this.addListeners();
    this.animate();
    this.resize();
  }

  componentWillUnmount() {
    this.removeListeners();
  }  

  initWebGL() {
    this.webgl = new WebGLHandler(this, VideoSrc);
    this.mount.appendChild(this.webgl.renderer.domElement);
    if ( this.useStats ) {
      this.stats = new Stats();
      this.mount.appendChild(this.stats.dom);
    }
  }

  addListeners() {
    this.handlerAnimate = this.animate.bind(this);

    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('mousemove', this.mousemove.bind(this));
  }

  removeListeners() {
    cancelAnimationFrame(this.animationFrame)
    window.removeEventListener('resize', this.resize.bind(this));
    window.removeEventListener('mousemove', this.mousemove.bind(this));
  }

  animate() {
    this.update();
    this.draw();

    if ( this.useStats ) {
      this.stats.update();
    }

    this.animationFrame = requestAnimationFrame(this.handlerAnimate);
  }

  update() {
    if (this.webgl) this.webgl.update();
  }

  draw() {
    if (this.webgl) this.webgl.draw();
  }

  resize() {
    if (this.webgl) this.webgl.resize();
  }

  mousemove(e) {
    
  }

  render () {

    const mountStyle = {
      width: '100vw',
      height: '100vh',
      background: '#000'
    }

    return (
      <div 
        ref={(mount) => {this.mount = mount}} 
        className="canvas-wrapper"
        style={mountStyle}
      />
    )
  }  
}

export default SectionKnowledge