const fs = require("fs");
const path = require("path");

const SHARP = require('sharp');
const PNG = require('pngjs').PNG;

let outFormat = 'color';

if (process.argv.length < 3) {
  console.log('Please provide source file!');
  process.exit(1);
}

const sourceFile = process.argv[2];

if (process.argv.length >3) {
  outFormat = process.argv[3];
  outFormat = outFormat === 'g' || outFormat === 'grey' ? 'grey' : 'color';
}

console.log('outFormat: ', outFormat);

const filepath = path.dirname(sourceFile);
const filename = path.basename(sourceFile);

const basename = `bmout_${path.basename(filename, '.raw')}.png`;

console.log(`Processing ${filepath}/${filename}`);

if (filename.endsWith('.png')) {
  SHARP(`${filepath}/${filename}`, {
      channels: 1,
  })
    .toBuffer((err, rawBuffer, info) => {
      if (info.channels > 1) {
        console.log('Only processing greyscale png, meaning only one channel!');
        process.exit(1);
      }
      const pngBuffer = Buffer.alloc(3 * info.width * info.height);
      let rawScale = 2;
      let pngScale = 3;

      for (let i = 0; i < info.width * info.height; i++) {
        pngBuffer[i * pngScale] = rawBuffer[i * rawScale];
        pngBuffer[i * pngScale + 1] = rawBuffer[i * rawScale + 1];
        pngBuffer[i * pngScale + 2] = 0;
      }

      const outConfig = {
        raw: {
          width: info.width,
          height: info.height,
          channels: 3,
        },
      };

      console.log(`write to ${filepath}/bmout_${basename}`);
      SHARP(pngBuffer, outConfig)
        .png()
        .resize(resolution, resolution)
        .toFile(`${filepath}/bmout_${basename}`);
    });
} else if (filename.endsWith('.r16')||filename.endsWith('.raw')) {
  fs.readFile(`${filepath}/${filename}`, (err, rawBuffer) => {
    const bytedepth = 2;
    const resolution = Math.sqrt(rawBuffer.length / bytedepth);

    if (outFormat === 'color') {
      console.log(`write to ${filepath}/bmout_clr_${basename}`);
      writePNG_RGB({
        width: resolution,
        height: resolution,
        buffer: rawBuffer,
        file: `${filepath}/bmout_clr_${basename}`,
      });
    } else {
      console.log(`write to ${filepath}/bmout_gry_${basename}`);
      writePNG_GREY({
        width: resolution,
        height: resolution,
        buffer: rawBuffer,
        file: `${filepath}/bmout_gry_${basename}`,
      });
    }
  });
} else {
  console.log('unknown file format: ', `${filepath}/${filename}`);
}

function writePNG_RGB(data) {
  const pngBuffer = Buffer.alloc(3 * data.width * data.height);
  let rawScale = 2;
  let pngScale = 3;
  for (let i = 0; i < data.width * data.height; i++) {
    pngBuffer[i * pngScale] = data.buffer[i * rawScale];
    pngBuffer[i * pngScale + 1] = data.buffer[i * rawScale + 1];
    pngBuffer[i * pngScale + 2] = 0;
  }
  const outImg = {
    raw: {
      width: data.width,
      height: data.height,
      channels: 3,
    },
  };

  SHARP(pngBuffer, outImg)
    .png()
    .resize(data.width, data.height)
    .toFile(data.file);

}

function writePNG_GREY(data) {
  const outConfig = {
    width: data.width,
    height: data.height,
    colorType: 0,
    inputColorType: 0,
    inputHasAlpha: false,
    bitDepth: 16,
    filterType: -1,
  }

  const outImg = new PNG(outConfig);
/*
  let min = 255;
  for (let i = 0; i < Math.floor(rawBuffer.length * 0.5); i++) {
    min = Math.min(rawBuffer[i * 2 + 1], min);
  }
  console.log(min);

  for (let i = 0; i < Math.floor(rawBuffer.length * 0.5); i++) {
    // rawBuffer[i * 2] *= 0.25; // lower bit (height from step to step)
    rawBuffer[i * 2 + 1] -= min; // heigher bit (overlall height)
  }
*/
  outImg.data = data.buffer;
  outImg.pack().pipe(fs.createWriteStream(data.file));
}
