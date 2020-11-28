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

function writeBuffer_RGB(data) {
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
  return SHARP(data.buffer, outImg)
    .png()
    .resize(data.width, data.height)
    .toFile(data.file);
}

function calcHeightmap(sourceFile, targetFile) {
  const extName = path.extname(sourceFile);
  const targetName = path.basename(targetFile);

  if (extName === '.png') {
    console.log('convert PNG', sourceFile);
    const depth = 16;
    const colorType = 2;

    const p = new Promise((resolve, reject) => {
      fs.createReadStream(sourceFile)
      .pipe(
        new PNG({
          colorType,
          depth,
          skipRescale: true,
        })
      ).on('metadata', function(metadata) {
        _meta = metadata;
      })
      .on('parsed', function(data) {
        const rawBuffer = Buffer.alloc(3 * this.width * this.height);
        let rawIdx = 0;
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;
            const raw = data[idx];
            rawBuffer[rawIdx] = Number(raw) & 0xff;
            rawBuffer[rawIdx + 1] = raw>>8;
            rawBuffer[rawIdx + 2] = 0;
            rawIdx += 3;
          }
        }
        const resolution = this.width;
        console.log(`write to ${targetFile}`);
        writeBuffer_RGB({
          width: resolution,
          height: resolution,
          buffer: rawBuffer,
          file: targetFile,
        }).then((result) => {
          resolve(Object.assign(result, { filename: targetName, depth, colorType }));
        })
        .catch((err) => {
          reject(err);
        });
      });
    });
    return p;
  }


  console.log('convert RAW');
  return new Promise((resolve, reject) => {
    fs.readFile(`${sourceFile}`, (err, rawBuffer) => {
      if (err) {
        return new Promise.reject(err);
      };

      const depth = 2;
      const resolution = Math.sqrt(rawBuffer.length / depth);
  
      console.log(`write to ${targetFile}, (${resolution})`);
      writePNG_RGB({
        width: resolution,
        height: resolution,
        buffer: rawBuffer,
        file: targetFile,
      }).then((result) => {
        resolve(Object.assign(result, { filename: targetName }));
      })
      .catch((err) => {
        reject(err);
      });
    });
  });
}

function getChannels(type) {
  switch(type) {
    case 0: return 1; // greyscale
    case 2: return 3; // rgb
    case 3: return 0; // indexed
    case 4: return 2; // greyscale, alpha
    case 6: return 4; // rgb, alpha
    default: return '';
  }
}

function validateSource(sourceFile) {
  const extName = path.extname(sourceFile);

  if (extName === '.png') {
    console.log('validate PNG', sourceFile);
    const p = new Promise((resolve, reject) => {
      try {
        fs.createReadStream(sourceFile)
        .pipe(
          new PNG({
            skipRescale: true,
          })
        ).on('metadata', (metadata) => {

          console.log(`metadata ${JSON.stringify(metadata)}`);
          resolve(Object.assign(metadata, { channels: getChannels(metaData.colorType)}));
        });
      } catch(err) {
        console.log(err.message);
        reject(err);
      }
    });
    return p;
  }


  console.log('convert RAW');
  return new Promise((resolve, reject) => {
    fs.readFile(`${sourceFile}`, (err, rawBuffer) => {
      if (err) {
        reject(err);
      };
      const info = {
        file: sourceFile,
        channels: 1,
      };

      let bitDepth = 2;
      const rawLength = rawBuffer.length;

      let resolution = Math.sqrt(rawLength / bitDepth);
      if (rawLength % resolution === 0) {
        info.width = resolution;
        info.height = resolution;
        info.depth = bitDepth * 8;
      } else if (rawLength % Math.sqrt(rawLength / ++bitDepth) === 0) {
        resolution = Math.sqrt(rawLength / bitDepth);
        info.width = resolution;
        info.height = resolution;
        info.depth = bitDepth * 8;
      }

      console.log(info);
      resolve(info);
    });
  });
}

module.exports = (() => ({
  calcHeightmap,
  validateSource,
}))();