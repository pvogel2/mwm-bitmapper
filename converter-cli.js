const path = require('path');
const cmdline = require('./lib.js/cli/commandline');
const converter = require('./lib.js/api/converter');

const sourceFile = cmdline.getSource(); // required
const targetFile = cmdline.getTarget(); // optional

if (!sourceFile) {
  console.error('missing source file, exiting');
  process.exit(1);
}


const extName = path.extname(sourceFile);
const targetName = path.basename(targetFile) || `bmout_${path.basename(sourceFile, extName)}.png`;
const targetPath = path.dirname(targetFile) || '';

converter.calcHeightmap(sourceFile, path.join(targetPath, targetName));