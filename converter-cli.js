const path = require('path');
const CONVERTER = require('./lib.js/api/converter');

const args = process.argv.slice(2);
console.log(process.env.NODE_ENV);
/**
 * konwn parameter names
 */
let sourceFile = ''; // required
let targetFile = ''; // optional
let debug = null; // optional

for (let i = 0; i  < args.length; i += 2) {
  const key = args[i];
  const value = args[i+1];

  switch(key) {
    case '-i':
    case '--in':
      sourceFile = value;
      break;
    case '-o':
    case '--out':
      targetFile = value;
      break;
    default: {
      console.log(`unknown parameter ${key}, exiting`);
      process.exit(1);
    }
  }
}

if (!sourceFile) {
  console.log('missing source or target');
  process.exit(1);
}

const extName = path.extname(sourceFile);
const targetName = path.basename(targetFile) || `bmout_${path.basename(sourceFile, extName)}.png`;
const targetPath = path.dirname(targetFile) || '';

CONVERTER.calcHeightmap(sourceFile, path.join(targetPath, targetName));