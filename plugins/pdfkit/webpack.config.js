const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "development",
  entry:  {
    fiera: './pdf.web.js'
  },
  output: {
    path:           path.resolve(__dirname, "./../../dist"),
    // libraryTarget: 'umd',
    // globalObject: "(typeof window !== 'undefined' ? window : this)",
    filename:   "fiera-pdf.js"
  },
  resolve: {
		alias: {
			fs: './virtual-fs.js'
		}
  },
  module: {    
    rules: [            
      { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: "transform-loader?brfs" },
      { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: "transform-loader?brfs" },
      { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: "transform-loader?brfs" },
      { test: /src[/\\]assets/, loader: 'arraybuffer-loader'},
      { test: /\.afm$/, loader: 'raw-loader'}
    ]
  },
  devtool: 'none'
}