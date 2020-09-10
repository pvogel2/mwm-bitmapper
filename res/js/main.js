let renderer = null;
const OrbitControls = THREE.OrbitControls;

function imageLoaded(event) {
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
    document.body.appendChild(c);
    const ctx = c.getContext( '2d' );
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    const data = [];

    let j = 0;
    let maxValue = 0;
    let minValue = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        maxValue = Math.max(maxValue, pixels[i]);
        minValue = Math.min(minValue, pixels[i]);
        data[j++] = pixels[i];// * 0.1;
    }

    console.log(minValue, maxValue);
    const position = [];
    const indices = [];
    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
          const idx = h * width + w;
          position.push(w - 0.5 * width, h - 0.5 * height, data[idx]);
          if (w < width - 1 && h < height - 1) {
              indices.push(idx, idx + width, idx + 1);
              indices.push(idx + 1, idx + width, idx + width + 1);
          }
      }
    }
    const geo  = new THREE.BufferGeometry();
    geo.setIndex( indices );
    geo.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );

    const material = new THREE.MeshBasicMaterial( {color: 0x444444, map: null, wireframe: true});

    const mesh = new THREE.Mesh( geo, material );
    mesh.rotation.x = Math.PI * -0.5;
    renderer.addObject('themesh', mesh);
}

function fetchImage() {
  const url = '/res/img/small.png';
  //const url = '/res/img/unrealIsland01.png';
  const img = new Image();
  img.addEventListener('load', imageLoaded);
  img.src = url;
}

window.addEventListener('DOMContentLoaded', () => {
    renderer = new mwm.Renderer({
        parentSelector: '#threejscontainer',
        control: true,
    });
    renderer.addAxes(1);
    renderer.start();
    fetchImage();
});