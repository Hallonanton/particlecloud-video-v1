import React, {Component} from 'react'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import VideoSrc from '../../img/test-face-150.mp4'


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
    this.pointSize = 1
    this.mountWidth = window.innerWidth
    this.mountHeight = window.innerHeight
    this.videoWidth = 150
    this.videoHeight = 150
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.mountWidth, this.mountHeight)

    //Interactive variables
    this.raycaster = new THREE.Raycaster()
    this.raycaster.params.Points.threshold = 10;
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
    this.stats = new Stats();
    this.mount.appendChild( this.stats.dom );
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

    //this.mouse.x = e.clientX - this.mountWidth / 2
    //this.mouse.y = -e.clientY + this.mountHeight / 2

    //console.log('mouse', this.mouse )
  }


  /*
   * This will continuesly run the animation
   */
  runScene = () => {
    this.renderScene()
    this.controls.update()
    this.stats.update()
    this.animationFrame = window.requestAnimationFrame(this.runScene)
  }


  /*
   * Thiss will trigger the animation to start
   */
  startScene = () => {
    this.initSceneCamera()
    this.initVideo()
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
      z: 200
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

    //Orbitcontrols
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05;

    this.controls.screenSpacePanning = false;

    this.controls.minDistance = 0;
    this.controls.maxDistance = 2000;

    this.controls.maxPolarAngle = Math.PI / 2;
  }


  /*
   * initVideo
   */
  initVideo = callback => {
    this.video.autoplay = true
    this.video.loop = true
    this.video.src = VideoSrc

    this.video.addEventListener('loadeddata', e => {
      this.videoWidth = this.video.videoWidth
      this.videoHeight = this.video.videoHeight

      this.pointcloud = this.generatePointcloud()
      this.scene.add( this.pointcloud )
       
      //requestAnimationFrame must start after the video has loaded
      if (!this.animationFrame) {
        this.animationFrame = window.requestAnimationFrame(this.runScene)
      }
    })
  }


  /*
   * createParticles
   */
  /*createParticles = () => {
    const frameData = this.getVideoFrameData(this.video)

    const geometry = new THREE.Geometry()
    geometry.morphAttributes = {} // This is necessary to avoid error.

    console.log( 'height', frameData.height )
    console.log( 'width', frameData.width )
    console.log( 'total', frameData.width * frameData.height )

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
      size: 1.5,
      vertexColors: THREE.VertexColors,
      sizeAttenuation: false
    })

    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)



    //Tests
    var geometry2 = new THREE.CircleGeometry( 5, 32 );
    var material2 = new THREE.MeshBasicMaterial( { color: 0xf00f00 } );
    this.circle = new THREE.Mesh( geometry2, material2 );
    this.circle.position.x = 0
    this.circle.position.y = 0
    this.scene.add( this.circle );
  }*/



  /*==============================================================================
    # TESTS
  ==============================================================================*/

  generatePointcloud() {

    const width = this.videoWidth;
    const height = this.videoHeight;

    let geometry = new THREE.Geometry();
    geometry.morphAttributes = {}

    //Loop and create a verticy for every pixel of the frame
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const vertex = new THREE.Vector3(
          x - width / 2,
          -y + height / 2,
          0
        )
        geometry.vertices.push(vertex)
        geometry.colors.push(this.defaultColor)
      }
    }

    geometry.computeBoundingBox();

    let material = new THREE.PointsMaterial( { size: this.pointSize, vertexColors: true } );
    
    return new THREE.Points( geometry, material );
  }


  /*==============================================================================
    # END TESTS
  ==============================================================================*/



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
   * Get distance between two points
   */
  getDistance = (x1, y1, x2, y2) => {
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;
    
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }


  /*
   * Redener the scene
   */
  renderScene = t => {

    const amplifier = 0.03
    const threshold = 18.4

    if (this.pointcloud) {

      //Look for mouse interactions
      this.raycaster.setFromCamera(this.mouse, this.camera)
      let intersects = this.raycaster.intersectObjects( this.scene.children )
      let intersectedIndexes = []

      if ( intersects ) {
        for ( let i = 0; i < intersects.length; i++ ) {
          intersectedIndexes.push( intersects[ i ].index )
        }
      }

      // To reduce CPU usage.
      const useCache = parseInt(t) % 3 === 0
      const imageData = this.getVideoFrameData(this.video, useCache)

      //Loop through all vertices
      for (let i = 0, length = this.pointcloud.geometry.vertices.length; i < length; i++) {
        
        //Current particle
        let particle = this.pointcloud.geometry.vertices[i]

        //Get alphaIndex for current particle
        let index = i * 4
        let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3
        
        if ( intersectedIndexes.includes(i) ) {
          this.pointcloud.geometry.colors[i] = new THREE.Color(0xf00f00)
        } else {
          this.pointcloud.geometry.colors[i] = this.defaultColor
        }

        //Animate z-index for particles brighter than threshold
        if ( gray > threshold ) {
          particle.z = gray * amplifier * 5;

        //Hide darker particles
        } else {
          particle.z = 1000000

        }
      }

      this.pointcloud.geometry.verticesNeedUpdate = true
      this.pointcloud.geometry.colorsNeedUpdate = true
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