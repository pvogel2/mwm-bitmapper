const clArgs = require('command-line-args');
const clUsage = require('command-line-usage');

const optionDefinitions = [
  { 
    name: 'in',
    alias: 'i',
    typeLabel: '{underline file}',
    description: 'The input file to process.',
    type: String,
    group: 'main',
  },
  { 
    name: 'convert',
    alias: 'c',
    description: 'Convert the input file to heightmap (default).',
    type: Boolean,
    group: 'main',
  },
  {
    name: 'examine',
    alias: 'e',
    type: Boolean,
    description: 'Examine the input file.',
    group: 'main',
  },
  {
    name: 'out',
    alias: 'o',
    type: String,
    typeLabel: '{underline file}',
    description: 'The target file.',
    group: 'main',
  },
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
    description: 'Generate verbose output.',
  },
  {
    name: 'debug',
    alias: 'd',
    type: Boolean,
    description: 'Generate debug output.',
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Show help and exit.',
    group: 'main',
  },
];

const sections = [
  {
    header: 'converter command line interface',
    content: 'Generate 8bit rgb png from 16bit raw or png files.'
  },
  {
    header: 'Main options',
    optionList: optionDefinitions,
    group: [ 'main' ],
  },
  {
    header: 'Misc',
    optionList: optionDefinitions,
    group: [ '_none' ],
  },
];

const options = clArgs(optionDefinitions);

const { main = {}, _none = {} } = options;

if (main.help) {
  console.log(clUsage(sections));
  process.exit(0);
};

if (_none.debug) {
  process.env.DEBUG = true;
};

if (_none.verbose) {
  process.env.VERBOSE = true;
};

module.exports = {
  getSource: () => main.in,
  getTarget: () => main.out,
  doConversion: () => main.convert,
  doExamine: () => main.examine,
};
