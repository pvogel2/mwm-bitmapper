import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import rollup from "rollup";

const NODE_ENV = process.env.NODE_ENV || "development";
const outputFile = NODE_ENV === "production" ? "./lib/prod.js" : "./lib/dev.js";

const config = {
  input: "./src/js/index.js",
  output: {
    file: './build/lib/dev.js',
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
      exclude: "node_modules/**",
    }),
    commonjs(), // ensure correct handling of es6 modules
    replace({ // use node env variables in js
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
  ],
  external: [
    'react',
    'react-dom',
    'three',
  ], // do not include peer dependencies in the bundle file
};

const watcher = rollup.watch(config);

export default config;