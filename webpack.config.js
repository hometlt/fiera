"use strict";

const
  fs = require('fs'),
  path = require('path'),
  argv = require('minimist')(process.argv.slice(2)),
  deepExtend = require('./src/util/object.js').deepExtend,
  loadJsonSync = require('./src/util/data.js').loadJsonSync,
  nodeExternals = require('webpack-node-externals'),
  webpack = require('webpack'),
  EntryGeneratorWebpackPlugin = require('entry-generator-webpack-plugin');

var buildConfiguration = {
  config: argv.modules || "modules.json",
  externals: {
    "fabricjs": "fabric",
    "caman": "Caman",
    "underscore": "_",
    "jquery": "$"
  },
  banner: "Fiera.js Copyright 2016, www.homeTLT.ru (Denis Ponomarev <ponomarevtlt@gmail.com>)",
  output: {
    name: "[name]",
    path: "dist"
  }
};

if(buildConfiguration.config){
  var _modulesSrc = path.resolve(__dirname, "src","modules.js");
  if(fs.existsSync(_modulesSrc)){
    fs.unlinkSync(_modulesSrc);
  }
  deepExtend(buildConfiguration,loadJsonSync(buildConfiguration.config));
}

var CONFIG = {
  common:{
    context: path.resolve(__dirname, "src"),
    entry: "./fiera.js",
    output: {
      path:    path.resolve(__dirname, buildConfiguration.output.path),
      library:  "fiera"
    },
    plugins: [
      new webpack.BannerPlugin(buildConfiguration.banner),
      new webpack.ProvidePlugin({
        fabric: 'fabricjs'
      }),
      new webpack.NoErrorsPlugin()
    ],
    target: 'node',
    externals: [
      nodeExternals(),
      buildConfiguration.externals
    ],
    module: {
      // loaders: [
      //   { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: "file" }
      // ]
    }
  },
  production: {
    output: {
      filename: buildConfiguration.output.name + ".js"
    },
    plugins : [
      new webpack.DefinePlugin({
        DEVELOPMENT: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true,
          unsafe: true
        }
      })
    ]
    // module: {
    //   loaders: {
    //     //   test: /\.js$/,
    //     //   exclude: /(node_modules|bower_components)/,
    //     //   loader: 'babel', // 'babel-loader' is also a valid name to reference
    //     //   query: {
    //     //     presets: ['es2015']
    //     //   }
    //   }
    // }
  },
  development: {
    plugins:[
      new webpack.DefinePlugin({
        DEVELOPMENT: true
      })
    ],
    output: {
      filename: buildConfiguration.output.name + ".dev.js"
    },
    watch:    !argv.prod && !argv.json,
    devtool: "cheap-inline-module-source-map"
  }
};


if(buildConfiguration.config){
  CONFIG.common.plugins.push(new EntryGeneratorWebpackPlugin('modules.js', [
    function(){
      var files = [];

      for(let module of buildConfiguration.modules){
        files.push('./modules/fiera.' + module + '.js');
      }
      for(let module of buildConfiguration.objects){
        files.push('./objects/' + module + '.js');
      }

      return files;
    }
  ]))
}

if(argv.prod){
  module.exports =  [
    deepExtend({},CONFIG.common,CONFIG.development),
    deepExtend({},CONFIG.common,CONFIG.production)
  ];
}else{
  module.exports = deepExtend(CONFIG.development,CONFIG.common);
}

