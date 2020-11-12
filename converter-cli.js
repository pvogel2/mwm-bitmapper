const CONVERTER = require('./lib.js/api/converter');

if (process.argv.length < 3) {
  console.log('Please provide source file!');
  process.exit(1);
}

const sourceFile = process.argv[2];

console.log('sourceFile: ', sourceFile);

CONVERTER.calcHeightmap(sourceFile);