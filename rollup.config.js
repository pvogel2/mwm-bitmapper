import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import run from '@rollup/plugin-run';
import copy from 'rollup-plugin-copy'
// import rollup from 'rollup';

const NODE_ENV = process.env.NODE_ENV || "development";

const config = [
  { // converter api and cli
    input: "./lib.js/converter-cli.js",
    output: {
      file: './build/lib.js/converter-cli.js',
    },
    plugins: [
      copy({
        targets: [
          { src: ['lib.js/api', 'lib.js/cli'], dest: 'build/lib.js' },
        ]
      }),
    ],
  },
  { // frontend for dev server
  input: "./src/js/index.js",
  output: {
    file: './build/dev/assets/js/bundle.js',
    format: "iife",
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'three': 'THREE',
    },
  },
  plugins: [
    resolve({ browser: true }), // resolve node modules needed to include in bundle
    babel({ // use bable to transpile js
      exclude: ['node_modules/**', 'lib.js/**'],
    }),
    commonjs(), // ensure correct handling of es6 modules
    replace({ // use node env variables in js
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    copy({
      targets: [
        { src: 'public', dest: 'build/dev' },
        { src: 'res/css', dest: 'build/dev/assets' },
      ]
    }),
  ],
  external: [
    'react',
    'react-dom',
    'three',
  ], // do not include peer dependencies in the bundle file
},
{  // backend for dev server, starting on demand
  input: "./lib.js/index.js",
  output: {
    file: './build/dev/server.js',
  },
  plugins: [
    copy({
      targets: [
        { src: ['lib.js/app.js', 'lib.js/routes'], dest: 'build/dev' },
        { src: ['lib.js/api'], dest: 'build/dev' },
        { src: 'data', dest: 'build' },
      ]
    }),
    NODE_ENV === 'development' && run(),
  ],
},
];

// const watcher = rollup.watch(config[0]);

export default config;