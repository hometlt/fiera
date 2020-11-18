import webpack from 'webpack'

import fs from "fs"
/*
import stream from "stream"
import util from 'util'
import buffer from 'buffer'
import string_decoder from 'string_decoder'
var fontkit = ...
export default fontkit.default
 */

import WebpackSources from "webpack-sources"
const nonJsFiles = fileName => !/\.[cm]?js$/i.test(fileName);

class WtfPlugin {
  constructor(options = { exclude: nonJsFiles }) {
    this._options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("WtfPlugin", (compilation) => {
      const libVar = compilation.outputOptions.library;
      const exclude = this._options.exclude;

      compilation.hooks.optimizeChunkAssets.tapAsync("WtfPlugin", (chunks, done) => {
        chunks.forEach(chunk => {
          if (chunk.entryModule && chunk.entryModule.buildMeta.providedExports) {
            chunk.files.forEach(fileName => {
              if (exclude && exclude(fileName, chunk)) {
                return;
              }

              // Add the exports to the bottom of the file (expecting only one file) and
              // add that file back to the compilation
              compilation.assets[fileName] = new WebpackSources.ConcatSource(
                  ...this._options.imports.map(item => `import ${item} from "${item}"\n`),
                  compilation.assets[fileName],
                  "\n",
                  this._options.exports
              )
            })
          }
        })
        done()
      })
    })
  }
}


let config = {
  // mode: "development",
  mode: "production",
  devtool: 'none',
  entry:  './src/index.js',
  output: {
    filename: "fontkit-bundle.min.js",
    library: "fontkit",
    libraryTarget: 'var'
  },
  target: "node",
  externals: {
    'stream':'stream',
    'fs': 'fs',
    'util': 'util',
    'buffer': 'buffer',
    'string_decoder': 'string_decoder'
  },
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.trie$/i,
        use: './buffer-loader.cjs',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [["latest-node", { "target": "current" }]],
            "plugins": [
                ["@babel/plugin-proposal-decorators", { "legacy": true }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new WtfPlugin({
      imports: ["fs", "stream", 'util', 'buffer', 'string_decoder'],
      exports: "export default fontkit.default"
    })
  ]
}

const compiler = webpack(config);

compiler.run((err, stats) => {
  console.log(stats.toString({
    chunks: false,
    colors: true
  }));
})