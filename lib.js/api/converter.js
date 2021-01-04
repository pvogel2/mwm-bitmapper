const fs = require("fs");
const path = require("path");

const SHARP = require('sharp');
const PNG = require('pngjs').PNG;

function writePNG_RGB(data) {
  const pngBuffer = Buffer.alloc(3 * data.width * data.height);
  let rawScale = 2;
  let pngScale = 3;
  const depth = 8;
  const colorType = 2;

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
   * returns a thenable function, handle result and error on your own
   */
  return SHARP(pngBuffer, outImg)
    .png()
    .resize(data.width, data.height)
    .toFile(data.file)
    .then(info => {
      return Object.assign(info, {depth, colorType});
    });
}

function writeBuffer_RGB(data) {
  const depth = 8;
  const colorType = 2;

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
    .toFile(data.file)
    .then(info => {
      return Object.assign(info, {depth, colorType});
    });
}

function calcHeightmap(sourceFile, targetFile) {
  const extName = path.extname(sourceFile);
  const targetName = path.basename(targetFile);

  if (extName === '.png') {
    console.log('convert PNG', sourceFile);
    const depth = 8;
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
          resolve(Object.assign(result, { filename: targetName}));
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
          resolve(Object.assign(metadata, { channels: getChannels(metadata.colorType)}));
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
        channels: 1, // all is interpreted as greyscale
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

      resolve(info);
    });
  });
}

function getRequiredWidth(w) {
  // check for w if not 0 and w power of 2
  if (w && !(w & (w - 1))) {
    return w;
  }
  w--;
  w |= w >> 1;
  w |= w >> 2;
  w |= w >> 4;
  w |= w >> 8;
  w |= w >> 16;
  w++;
  return w;
}
/**
 * For now we expect a greyscale png file as source
 * @param {string} sourceFile 
 * @param {number} tileSize 
 * @param {string} targetBase 
 */
async function __calcTiles(sourceFile, tileSize, targetBase) {
  const depth = 8;
  const colorType = 2;
  const metadata = await validateSource(sourceFile);

  let width = Number(metadata.width);
  const requiredWidth = getRequiredWidth(width);

  const tileCount = Math.floor(requiredWidth / tileSize);

  if (!tileCount) {
    console.log(`Width of sourcefile not sufficient (${tileCount})`);
    return null;
  }

  const p = new Promise((resolve, reject) => {
    fs.createReadStream(sourceFile).pipe(
      new PNG({
        colorType,
        depth,
        skipRescale: true,
      })
    ).on('metadata', function(metadata) {
      _meta = metadata;
    }).on('parsed', function(data) {
      const buffers = [];
      const rawIndices = [];
      for (let bh = 0;bh < tileCount;bh++) {
        for (let bw = 0;bw < tileCount;bw++) {
          if (!buffers[bh]) {
            buffers[bh] = [];
          }
          if (!rawIndices[bh]) {
            rawIndices[bh] = [];
          }
          buffers[bh][bw] = Buffer.alloc(3 * tileSize * tileSize);
          rawIndices[bh][bw] = 0;
        }
      }

      const rawWidth = _meta.width;
      const rawHeight = _meta.height;

      for (var y = 0; y < rawHeight; y++) {
        for (var x = 0; x < rawWidth; x++) {
          var idx = (rawWidth * y + x) << 2;
          const raw = data[idx];
          xIdx = Math.floor(x / tileSize);
          yIdx = Math.floor(y / tileSize);

          if (buffers[yIdx] && buffers[xIdx]) {
            const rawBuffer = buffers[yIdx][xIdx];
            const rawIdx = rawIndices[yIdx][xIdx];

            rawBuffer[rawIdx] = Number(raw) & 0xff;
            rawBuffer[rawIdx + 1] = raw>>8;
            rawBuffer[rawIdx + 2] = 0;
            rawIndices[yIdx][xIdx] += 3;
          }
        }
      }

      const allPromises = [];
      let index = 1;
      for (let bh = 0;bh < tileCount; bh++) {
        for (let bw = 0;bw < tileCount; bw++) {

          const targetFile = `${index < 10 ? '0' : ''}${index++}_${targetBase}`;

          console.log(`write to ${targetFile}`);

          allPromises.push(writeBuffer_RGB({
            width: tileSize,
            height: tileSize,
            buffer: buffers[bh][bw],
            file: targetFile,
          }));
        }
      }

      Promise.all(allPromises)
      .then(() => {
        resolve({ filename: `xx_${targetBase}` });
      }).catch((err) => {
        reject(err);
      });
    });
  });

  return p;
};

async function calcTiles(sourceFile, tileSize, targetBase) {
  const depth = 8;
  const colorType = 2;
  let _meta = {};

  const p = new Promise((resolve, reject) => {
    fs.createReadStream(sourceFile).pipe(
      new PNG({
        colorType,
        depth,
        skipRescale: true,
      })
    ).on('metadata', function(metadata) {
      _meta = metadata;
    }).on('parsed', function(data) {
       const rawWidth = _meta.width;
      const rawHeight = _meta.height;

      const reqWidth = getRequiredWidth(_meta.width);
      const tileCount = Math.floor(reqWidth / tileSize);
      let rawIdx = 0;
      const rawBuffer = Buffer.alloc(3 * reqWidth * reqWidth);

      for (let y = 0; y < reqWidth; y++) {
        for (let x = 0; x < reqWidth; x++) {
          const idx = (rawWidth * y + x) << 2;
          const raw = ((y < rawHeight && x <  rawWidth) ? data[idx] : 0);

          rawBuffer[rawIdx] = Number(raw) & 0xff;
          rawBuffer[rawIdx + 1] = raw>>8;
          rawBuffer[rawIdx + 2] = 0;
          rawIdx += 3;
        }
      }

      /* writeBuffer_RGB({
        width: reqWidth,
        height: reqWidth,
        buffer: rawBuffer,
        file: targetBase,
      }).then(() => {
        resolve({ filename: `xx_${targetBase}` });
      }).catch((err) => {
        reject(err);
      }); */
      const outImg = {
        raw: {
          width: reqWidth,
          height: reqWidth,
          channels: 3,
        },
      };
    
      const dWidth = reqWidth - _meta.width;
      const startldWidth = Math.floor(dWidth / 2);
      const endldWidth = dWidth - startldWidth;

      const result = SHARP(rawBuffer, outImg)
        .png()
        .resize(_meta.width, _meta.width)
        .extend({
          top: startldWidth,
          left: startldWidth,
          bottom: endldWidth,
          right: endldWidth,
        });
      
      for (let bh = 0; bh < tileCount; bh++) {
        for (let bw = 0; bw < tileCount; bw++) {
          result.extract({
            left: bw * tileSize,
            top: bh * tileSize,
            width: tileSize,
            height: tileSize,
          }).toFile(`${bw}${bh}_${targetBase}`, function(err) {
            console.log(err);
          });
        }
      }
    });
  });

  return p;
};

module.exports = (() => ({
  calcHeightmap,
  validateSource,
  calcTiles,
}))();