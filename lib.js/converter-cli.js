const path = require('path');
const cmdline = require('./cli/commandline');
const converter = require('./api/converter');

const sourceFile = cmdline.getSource(); // required
const targetFile = cmdline.getTarget(); // optional
console.log('sourceFile', sourceFile);
if (!sourceFile) {
  console.error('missing source file, exiting');
  process.exit(1);
}

const extName = path.extname(sourceFile);
const targetName = targetFile ? path.basename(targetFile) : `bmout_${path.basename(sourceFile, extName)}.png`;
const targetPath = targetFile ? path.dirname(targetFile) : '';

if (cmdline.doExamine()) {
  converter.validateSource(sourceFile);
}

if (cmdline.doConversion()) {
  converter.calcHeightmap(sourceFile, path.join(targetPath, targetName));
}

if (cmdline.doTiles()) {
  const tileSize = cmdline.getTileSize(); // required
  converter.calcTiles(sourceFile, tileSize, path.join(targetPath, targetName));
}