const path = require('path');
const CONVERTER = require('./lib.js/api/converter');

if (process.argv.length < 3) {
  console.log('Please provide source file!');
  process.exit(1);
}

const sourceFile = process.argv[2];
const extName = path.extname(sourceFile);
const targetName = `bmout_${path.basename(sourceFile, extName)}.png`;

console.log('targetName', targetName);
if (process.argv.length < 4) {
  console.log(`No target file name provided, write to ${targetName}`);
} else {
  targetFile = process.argv[3]; 
}

CONVERTER.calcHeightmap(sourceFile, targetName);