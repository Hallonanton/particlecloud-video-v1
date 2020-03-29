import React, {Component} from 'react'

//Threejs addons
import * as THREE from 'three'

//Component
class Animation extends Component {

  /*
   * componentDidMount
   */
  componentDidMount(){
    //Basic Variables
    this.mountWidth = window.innerWidth
    this.mountHeight = window.innerHeight

    //Variables
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    //Audio variables
    //https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
    this.fftSize = 2048;
    this.frequencyRange = {
        bass: [20, 140],
        lowMid: [140, 400],
        mid: [400, 2600],
        highMid: [2600, 5200],
        treble: [5200, 14000],
    };

    //Add eventListener
    window.addEventListener('resize', this.onResize);

    //Start aniamtion
    this.init();
  }

  /*
   * componentWillUnmount
   */
  componentWillUnmount() {
    //Stop animation
    this.mount.removeChild(this.renderer.domElement)

    //Remove eventListener
    window.removeEventListener('resize', this.onResize)
  }

  /*
   * resize
   */
  onResize = () => {
    this.mountWidth = window.innerWidth;
    this.mountHeight = window.innerHeight;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.mountWidth, this.mountHeight);

    this.camera.aspect = this.mountWidth / this.mountHeight;
    this.camera.updateProjectionMatrix();
  }

  /*
   *  Init
   */

  init = () => {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    this.renderer = new THREE.WebGLRenderer();
    this.mount.appendChild( this.renderer.domElement )

    this.initCamera();

    this.onResize();

    this.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
      getUserMedia: (c) => {
        return new Promise(function (y, n) {
          (navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(navigator, c, y, n);
        });
      }
    } : null);

    if (this.mediaDevices) {
        this.initAudio();
        this.initVideo();
    }

    this.draw();
  }

  /*
   * initCamera
   */
  initCamera = () => {
    const fov = 45;
    const aspect = this.mountWidth / this.mountHeight;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 10000);
    const z = Math.min(this.mountWidth, this.mountHeight);
    this.camera.position.set(0, 0, z);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(this.camera);
  }

  /*
   * initVideo
   */
  initVideo = () => {
    this.video.autoplay = true;

    const option = {
      video: true,
      audio: false
    };

    this.mediaDevices.getUserMedia(option)
      .then((stream) => {
          this.video.srcObject = stream;
          this.video.addEventListener("loadeddata", () => {
              this.videoWidth = this.video.videoWidth;
              this.videoHeight = this.video.videoHeight;

              this.createParticles();
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /*
   * getImageData
   */
  getImageData = (image, useCache) => {
    if (useCache && this.imageCache) {
        return this.imageCache;
    }

    const w = image.videoWidth;
    const h = image.videoHeight;

    this.canvas.width = w;
    this.canvas.height = h;

    this.ctx.translate(w, 0);
    this.ctx.scale(-1, 1);

    this.ctx.drawImage(image, 0, 0);
    this.imageCache = this.ctx.getImageData(0, 0, w, h);

    return this.imageCache;
  }

  /*
   * initAudio
   */
  initAudio = () => {
    const audioListener = new THREE.AudioListener();
    this.audio = new THREE.Audio(audioListener);

    const audioLoader = new THREE.AudioLoader();

    audioLoader.load('/test.MP3', (buffer) => {
        this.audio.setBuffer(buffer);
        this.audio.setLoop(true);
        this.audio.setVolume(0.5);
        this.audio.play();
    });

    this.analyser = new THREE.AudioAnalyser(this.audio, this.fftSize);
  }

  /**
   * https://github.com/processing/p5.js-sound/blob/v0.14/lib/p5.sound.js#L1765
   *
   * @param data
   * @param _frequencyRange
   * @returns {number} 0.0 ~ 1.0
   */
  getFrequencyRangeValue = (data, _frequencyRange) => {
      const nyquist = 48000 / 2;
      const lowIndex = Math.round(_frequencyRange[0] / nyquist * data.length);
      const highIndex = Math.round(_frequencyRange[1] / nyquist * data.length);
      let total = 0;
      let numFrequencies = 0;

      for (let i = lowIndex; i <= highIndex; i++) {
          total += data[i];
          numFrequencies += 1;
      }
      return total / numFrequencies / 255;
  }

  /*
   * createParticles
   */
  createParticles = () => {
    const imageData = this.getImageData(this.video);
    const geometry = new THREE.Geometry();
    geometry.morphAttributes = {};  // This is necessary to avoid error.
    const material = new THREE.PointsMaterial({
      size: 1,
      color: 0xff3b6c,
      sizeAttenuation: false
    });

    for (let y = 0, height = imageData.height; y < height; y += 1) {
      for (let x = 0, width = imageData.width; x < width; x += 1) {
        const vertex = new THREE.Vector3(
          x - imageData.width / 2,
          -y + imageData.height / 2,
          0
        );
        geometry.vertices.push(vertex);
      }
    }

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }


  /*
   * draw
   */
  draw = (t) => {
    let r, g, b;

    // audio
    if (this.analyser) {
        // analyser.getFrequencyData() would be an array with a size of half of fftSize.
        const data = this.analyser.getFrequencyData();

        const bass = this.getFrequencyRangeValue(data, this.frequencyRange.bass);
        const mid = this.getFrequencyRangeValue(data, this.frequencyRange.mid);
        const treble = this.getFrequencyRangeValue(data, this.frequencyRange.treble);

        r = bass;
        g = mid;
        b = treble;
    }

    // video
    if (this.particles) {
        this.particles.material.color.r = 1 - r;
        this.particles.material.color.g = 1 - g;
        this.particles.material.color.b = 1 - b;

        const density = 5;
        const useCache = parseInt(t) % 2 === 0;  // To reduce CPU usage.
        const imageData = this.getImageData(this.video, useCache);
        for (let i = 0, length = this.particles.geometry.vertices.length; i < length; i++) {
            const particle = this.particles.geometry.vertices[i];
            if (i % density !== 0) {
                particle.z = 10000;
                continue;
            }
            let index = i * 4;
            let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
            let threshold = 300;
            if (gray < threshold) {
                if (gray < threshold / 3) {
                    particle.z = gray * r * 5;

                } else if (gray < threshold / 2) {
                    particle.z = gray * g * 5;

                } else {
                    particle.z = gray * b * 5;
                }
            } else {
                particle.z = 10000;
            }
        }
        this.particles.geometry.verticesNeedUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.draw);
  }

  /*
   * render
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
        <video ref={(video) => {this.video = video}} style={{display: 'none'}}></video>
      </div>
    )
  }
}


//Export
export default Animation