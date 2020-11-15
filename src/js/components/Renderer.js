import React from 'react';
import { connect } from 'react-redux';

import { Renderer as MWMRenderer } from 'mwm-renderer';
import RendererControls from './RendererControls';

class Renderer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      parentId: 'mwmrenderer',
      light: null,
      offset: 0,
    }

    this.material = null;
    this.mesh = null;
  }

  componentDidMount() {
    this.renderer = new MWMRenderer({
      fov: 45,
      cameraNear: 0.01,
      cameraFar: 2000,
      position: {x: 0, y: 15, z: 70},
      target: {x: 0, y: 0, z: 0},
      parentSelector: `#${this.state.parentId}`,
      control: true,
    });

    this.renderer.start();
    this.addLight();
    this.renderer.addAxes(100);

    if (this.props.heightmap) {
      this.addHeightmap();
    }
  }

  addLight() {
    const sun = new THREE.DirectionalLight( 0x666666, 2, 1000 );
    sun.position.set(-400, 400, 0);
    sun.castShadow = true;
    sun.target.position.set(0, 0, 0);

    //Set up shadow properties for the light
    sun.shadow.mapSize.width = 2048;  // default
    sun.shadow.mapSize.height = 2048; // default
    sun.shadow.camera.near = 0.05;       // default
    sun.shadow.camera.far = 1500;
    var d = 1500;// default
    sun.shadow.camera.left = - d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = - d;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;

    this.renderer.addObject('sun', sun);
  }

  getMaterial() {
    const uniforms = THREE.UniformsUtils.merge( [
      THREE.UniformsLib[ "lights" ]
    ] );
  
  
    uniforms.scale = {type: "f", value: 1.0};

    this.material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      transparent: true,
      depthWrite: true,
      color: 0x444444,
      map: null, 
      wireframe: true,
      vertexShader:   vertexshader,
      fragmentShader: fragmentshader,
      lights: true,
    });
    return this.material;
    // return new THREE.MeshLambertMaterial( {color: 0x444444, map: null, wireframe: true, side: THREE.DoubleSide});
  }
  
  heightmapLoaded(img) {
    const width = img.width;
    const height = img.height;
    const c = document.createElement('canvas');
    c.style.zIndex = 1;
    c.style.position = 'absolute';
    c.style.left = `50px`;
    c.style.top = `50px`;
    c.style.border = '1px solid white';
    c.width = width;
    c.height = height;
    //document.body.appendChild(c);
    const ctx = c.getContext( '2d' );
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    const data = [];

    let j = 0;
    let maxValue = 0;
    let minValue = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      let p = pixels[i] / 255 + pixels[i + 1];
      if (i === 0) {
        maxValue = minValue = p;
      }  

      maxValue = Math.max(maxValue, p);
      minValue = Math.min(minValue, p);
      data[j++] = p;
    }

    const position = [];
    const indices = [];
    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
          const idx = h * width + w;
          position.push(w - 0.5 * width, h - 0.5 * height, data[idx]);
          if (w < width - 1 && h < height - 1) {
              indices.push(idx, idx + 1, idx + width);
              indices.push(idx + 1, idx + width + 1, idx + width);
          }
      }
    }
    const geo  = new THREE.BufferGeometry();
    geo.setIndex( indices );
    geo.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
    geo.computeVertexNormals();

    const material = this.getMaterial();

    this.mesh = new THREE.Mesh( geo, material );
    this.state.offset = -minValue;
    this.mesh.position.y = -minValue;
    this.mesh.rotation.x = Math.PI * -0.5;
    // const offset = maxValue - minValue;
    console.log(this.mesh.position, minValue, maxValue);
    this.renderer.addObject(`themesh${Math.random()}`, this.mesh);
  }

  onControlsChange(data) { 
    this.material.uniforms.scale.value = data.scale;
    this.mesh.position.y = this.state.offset * data.scale;
    this.material.uniformsNeedUpdate = true;
    // this.mesh.geometry.computeVertexNormals();
  }

  addHeightmap() {// heightmap
    const img = new Image();
    img.addEventListener('load', this.heightmapLoaded.bind(this, img));
    img.src = `/converted/${this.props.heightmap}`;
  }

  render() {
    return <>
      <div
        className={this.props.className}
        id={this.state.parentId}
      >
      </div>
      <RendererControls onChange={this.onControlsChange.bind(this)} />
    </>
  }
};

function mapStateToProps(state) {
  return {
    heightmap: state.heightmap,
   }
};

function mapDispatchToProps(dispatch) {
  return {
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Renderer);


const vertexshader = `
attribute vec3 color;
varying vec3 vNormal;
varying float directionalStrength;
uniform float scale;

#if NUM_DIR_LIGHTS > 0
  struct DirectionalLight {
    vec3 direction;
    vec3 color;
  };

  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

varying vec4 vColor;

void main() {
  vNormal = normalMatrix * normal;
  #if NUM_DIR_LIGHTS > 0
    directionalStrength = max(dot(vNormal, normalize(directionalLights[ 0 ].direction)), 0.0);
  #else
    directionalStrength = 1.;
  #endif

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.z * scale, 1. );
  vColor = vec4( color, 1. );
}`;

const fragmentshader = `
varying vec4 vColor;
varying float directionalStrength;

vec3 directionalColor = vec3(0., 0., 0.);
    
#if ( NUM_DIR_LIGHTS > 0 )
  struct DirectionalLight {
    vec3 direction;
    vec3 color;
  };

  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

#endif

void main() {
  #if ( NUM_DIR_LIGHTS > 0 )
    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
      directionalColor += directionalLights[ i ].color * directionalStrength;
    }
    #pragma unroll_loop_end
  #endif

  gl_FragColor = vec4(vColor.rgb * directionalColor, 1.);
}`;
