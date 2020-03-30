import React, {Component} from 'react'
import * as THREE from 'three'
import VideoSrc from '../../img/test-face.mp4'


//Component
class Animation extends Component {

  /*
   * componentDidMount
   */
  componentDidMount(){

    //Canvas
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    //Scene variables
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x111111)

    //Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    //Basic variables
    this.defaultColor = new THREE.Color(0x27ae60)
    this.mountWidth = window.innerWidth
    this.mountHeight = window.innerHeight
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.mountWidth, this.mountHeight)

    //Interactive variables
    this.mouse = {
      x: 999999,
      y: 999999,
    }
    this.mouseIntersected = null

    //Add eventListeners
    window.addEventListener('mousemove', this.onMousemove)
    window.addEventListener('resize', this.onResize)

    //Start scene
    this.mount.appendChild(this.renderer.domElement)
    this.prepareScene()
    this.startScene()
  }

  /*
   * componentWillUnmount
   */
  componentWillUnmount() {
    //Stop animation
    this.stopScene()
    this.mount.removeChild(this.renderer.domElement)

    //Remove eventListener
    window.removeEventListener('resize', this.onResize)
  }

  /*
   * resize
   */
  onResize = () => {
    this.mountWidth = window.innerWidth
    this.mountHeight = window.innerHeight

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.mountWidth, this.mountHeight)

    this.camera.aspect = this.mountWidth / this.mountHeight
    this.camera.updateProjectionMatrix()
  }


  /*
   * onMousemove
   */
  onMousemove = e => {
    e.preventDefault()
    this.mouse.x = ( e.clientX / this.mountWidth ) * 2 - 1
    this.mouse.y = - ( e.clientY / this.mountHeight ) * 2 + 1
  }


  /*
   * This will continuesly run the animation
   */
  runScene = () => {
    this.renderScene()
    this.animationFrame = window.requestAnimationFrame(this.runScene)
  }


  /*
   * Thiss will trigger the animation to start
   */
  startScene = () => {
   if (!this.animationFrame) {
      this.animationFrame = window.requestAnimationFrame(this.runScene)
    }
  }


  /*
   * This will stop the animation
   */
  stopScene = () => {
    cancelAnimationFrame(this.animationFrame)
    if ( this.video ) {
      this.video.pause()
    }
  }


  /*
   * This setups variables and functions before the scene starts
   */
  prepareScene = () => {
    this.initSceneCamera()
    this.initVideo()
  }


  /*
   * initSceneCamera
   */
  initSceneCamera = () => {

    //const z = Math.min(this.mountWidth, this.mountHeight);
    this.camperaOptions = {
      fov: 45,
      aspect: this.mountWidth / this.mountHeight,
      near: 0.1,
      far: 10000,
      x: 0,
      y: 0,
      z: 1500
    }

    this.camera = new THREE.PerspectiveCamera(
      this.camperaOptions.fov,
      this.camperaOptions.aspect,
      this.camperaOptions.near,
      this.camperaOptions.far
    )

    this.camera.position.set(
      this.camperaOptions.x,
      this.camperaOptions.y, 
      this.camperaOptions.z
    )

    this.camera.lookAt(0, 0, 0)

    this.scene.add(this.camera)
  }


  /*
   * initVideo
   */
  initVideo = () => {
    this.video.autoplay = true
    this.video.loop = true
    this.video.src = VideoSrc

    this.video.addEventListener('loadeddata', e => {
      this.videoWidth = this.video.videoWidth
      this.videoHeight = this.video.videoHeight

      this.createParticles()
    })
  }


  /*
   * createParticles
   */
  createParticles = () => {
    const frameData = this.getVideoFrameData(this.video)

    const geometry = new THREE.Geometry()
    geometry.morphAttributes = {} // This is necessary to avoid error.

    //Loop and create a verticy for every pixel of the frame
    for (let y = 0, height = frameData.height; y < height; y += 1) {
      for (let x = 0, width = frameData.width; x < width; x += 1) {
        const vertex = new THREE.Vector3(
          x - frameData.width / 2,
          -y + frameData.height / 2,
          0
        )
        geometry.vertices.push(vertex)
        geometry.colors.push(this.defaultColor)
      }
    }

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: THREE.VertexColors,
      sizeAttenuation: false
    })

    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)
  }


  /*
   * getVideoFrameData
   */
  getVideoFrameData = (frame, useCache) => {
    if (useCache && this.frameCache) {
      return this.frameCache
    }

    const w = frame.videoWidth
    const h = frame.videoHeight

    this.canvas.width = w
    this.canvas.height = h

    this.ctx.translate(w, 0)
    this.ctx.scale(-1, 1)

    this.ctx.drawImage(frame, 0, 0)
    this.frameCache = this.ctx.getImageData(0, 0, w, h)

    return this.frameCache
  }


  /*
   * Redener the scene
   */
  renderScene = t => {

    const density = 20
    const amplifier = 0.3
    const threshold = 18.4

    if (this.particles) {

      // To reduce CPU usage.
      const useCache = parseInt(t) % 3 === 0
      const imageData = this.getVideoFrameData(this.video, useCache)

      //Loop through all vertices
      for (let i = 0, length = this.particles.geometry.vertices.length; i < length; i++) {
        
        //Current particle
        let particle = this.particles.geometry.vertices[i]

        //Set z-index to be very high so that the particle is hidden from view
        if (i % density !== 0) {
          particle.z = 1000000
          continue;
        }

        //Get alphaIndex for current particle
        let index = i * 4
        let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3
        
        //Animate z-index for particles brighter than threshold
        if ( gray > threshold ) {
          particle.z = gray * amplifier * 5;

        //Hide darker particles
        } else {
          particle.z = 0

        }
      }

      this.particles.geometry.verticesNeedUpdate = true
    }

    this.renderer.render(this.scene, this.camera)
  }


  /*
   * Render component
   */
  render() {

    const mountStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%'
    }

    return (
      <div 
        ref={(mount) => {this.mount = mount}} 
        className="canvas-wrapper"
        style={mountStyle}
      >
        <video 
          ref={(video) => {this.video = video}}
          style={{display: 'none'}} 
        />
      </div>
    )
  }
}


//Export
export default Animation