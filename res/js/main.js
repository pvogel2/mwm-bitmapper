let renderer = null;
// const OrbitControls = THREE.OrbitControls;

let countMeshes = 0;
function imageLoaded(merge, event) {
    const img = event.currentTarget;
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
    const scale = 1;
    for (let i = 0; i < pixels.length; i += 4) {
        let p = pixels[i] / 255;
        if (merge) {
             p += pixels[i + 1];
        }
        maxValue = Math.max(maxValue, pixels[i + 1]);
        minValue = Math.min(minValue, pixels[i + 1]);
        data[j++] = p * scale;
    }

    for (let i = 0; i < data.length; i++) {
        data[i] -= (scale - 1) * maxValue; 
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
    const material = new THREE.MeshLambertMaterial( {color: 0x444444, map: null, wireframe: true, side: THREE.DoubleSide});

    const mesh = new THREE.Mesh( geo, material );
    mesh.rotation.x = Math.PI * -0.5;
    mesh.position.x = countMeshes++ * 1100;
    renderer.addObject(`themesh${Math.random()}`, mesh);
}

function fetchImage(url, merge) {
  //const url = '/res/img/terrain.png';
  /// const url = '/res/img/out.png';
  //const url = '/res/img/small.png';
  //const url = '/res/img/unrealIsland01.png';
  const img = new Image();
  img.addEventListener('load', imageLoaded.bind(this, merge));
  img.src = url;
}

function addLight(renderer) {
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
    renderer.addObject('sun', sun);
}
window.addEventListener('DOMContentLoaded', () => {
    return;
    renderer = new mwm.Renderer({
        parentSelector: '#threejscontainer',
        control: true,
    });
    renderer.addAxes(1);
    addLight(renderer);
    renderer.start();
    // fetchImage('/res/img/bmout_unrealisland01.png', true);
    fetchImage('/res/img/bmout_clr_bmout_unrealExport02.r16.png', true);
    // fetchImage('/res/img/untitled.png', true);
});