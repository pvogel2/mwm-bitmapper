import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";

const NODE_ENV = process.env.NODE_ENV || "development";
const outputFile = NODE_ENV === "production" ? "./lib/prod.js" : "./lib/dev.js";

export default {
  input: "./src/js/index.mjs",
  output: {
    file: './build/lib/dev.js',
    format: "cjs",
  },
  plugins: [
    replace({ // use node env variables in js
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    babel({ // use bable to transpile js
      exclude: "node_modules/**",
    }),
    commonjs(), // ensure correct handling of es6 modules
    resolve({ browser:true }), // resolve node modules needed to include in bundle
  ],
  external: id => /^react|styled-jsx/.test(id), // do not include peer dependencies in the bundle file
};