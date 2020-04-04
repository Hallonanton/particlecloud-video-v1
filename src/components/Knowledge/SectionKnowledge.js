import React, { Component } from 'react'
import WebGLHandler from './WebglHandler'



/*==============================================================================
  # Component
==============================================================================*/

class SectionKnowledge extends Component {

  componentDidMount() {
    this.initWebGL();
    this.addListeners();
    this.animate();
    this.resize();
  }

  componentWillUnmount() {
    this.removeListeners();
  }  

  initWebGL() {
    this.webgl = new WebGLHandler(this);
    this.mount.appendChild(this.webgl.renderer.domElement);
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
      position: 'absolute',
      width: '100%',
      height: '100%',
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