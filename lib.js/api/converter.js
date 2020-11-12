const fs = require("fs");
const path = require("path");

const SHARP = require('sharp');
const PNG = require('pngjs').PNG;

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

  /**
   * returns a thenable function, handle result and error on your oun
   */
  return SHARP(pngBuffer, outImg)
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

  outImg.data = data.buffer;
  outImg.pack().pipe(fs.createWriteStream(data.file));
}

function calcHeightmap(sourceFile) {
  const sourcePath = 'data/uploads';
  const targetPath = 'data/converted';
  const basename = `${path.basename(sourceFile, '.raw')}.png`;


  const targetName = `bmout_${basename}`;
  const targetFile = `${targetPath}/${targetName}`;

  /*+++++++++++++++++++++++*/
  if (sourceFile.endsWith('.png')) {
    console.log('convert PNG', `${sourcePath}/${sourceFile}`);
    const p = new Promise((resolve, reject) => {
      SHARP(`${sourcePath}/${sourceFile}`)
      .toBuffer((err, rawBuffer, info) => {
        console.log(err, 'info:', info);
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

        console.log(`write to ${targetFile}`);
        SHARP(pngBuffer, outConfig)
          .png()
          // .resize(info.width, info.height)
          .toFile(`${targetFile}`)
          .then((result) =>{
            resolve('ok)');
          });
      });
    });
    return p;
    /*+++++++++++++++++++++++*/
  }


  console.log('convert RAW');
  return new Promise((resolve, reject) => {
    fs.readFile(`${sourcePath}/${sourceFile}`, (err, rawBuffer) => {
      if (err) {
        return new Promise.reject(err);
      };

      const bytedepth = 2;
      const resolution = Math.sqrt(rawBuffer.length / bytedepth);
  
      console.log(`write to ${targetFile}, (${resolution})`);
      writePNG_RGB({
        width: resolution,
        height: resolution,
        buffer: rawBuffer,
        file: `${targetFile}`,
      }).then((result) => {
        resolve(Object.assign(result, { filename: targetName }));
      })
      .catch((err) => {
        reject(err);
      });
    });
  });
}

module.exports = (() => ({
  calcHeightmap,
}))();