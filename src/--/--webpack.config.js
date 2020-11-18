

import webpack from 'webpack';
import path from 'path';
import minimist from 'minimist';
import url from 'url'
import {collectInfo,copyFiles} from './--webpack-tools.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const argv    = minimist(process.argv.slice(2));


let PROD =  argv.prod || argv.p,
    COPY = argv.copy || argv.c || false,
    WATCH = argv.watch || argv.w || false;

//function babel(EntryPoint){
//  if(BABEL){
//    return ['babel-polyfill',EntryPoint]
//  }else{
//    return EntryPoint
//  }
//}
let config = {
  mode: PROD ? "production" : "development",
  plugins: [
    new webpack.ProvidePlugin({}),
    new webpack.BannerPlugin({
      banner: tools.bannerString
    }),
    new webpack.DefinePlugin({
      DEVELOPMENT: JSON.stringify(!PROD)
    })
  ],
  entry:  {
    fiera: './src/fiera.web.js'
    // fiera: babel('./src/fiera.js')
  },
  output: {
    path:           path.resolve(__dirname, "./dist"),
    libraryTarget: 'umd',
    globalObject: "(typeof window !== 'undefined' ? window : this)",
    filename:   "[name].js"
  },
  devServer: {
    contentBase: __dirname,
    port: 8080,
    host: `localhost`,
  },
  devtool:      PROD ? false : 'source-map',
  target: "web",
// node: {
//   fs: 'empty',
//   "canvas": "empty",
//   "jsdom": "empty",
//   "xmldom": "empty",
//   "pdfkit": "empty",
// },
  externals: [
    // nodeExternals(),
    {
      /*fabricJS for NodeJS Extrernals*/
        "jsdom/lib/jsdom/living/generated/utils": "jsdom/lib/jsdom/living/generated/utils",
        "jsdom/lib/jsdom/browser/resources/resource-loader": "jsdom/lib/jsdom/browser/resources/resource-loader",
        "jsdom/lib/jsdom/utils": "jsdom/lib/jsdom/utils",
        "canvas": "canvas",
        "request": "request",
        "jsdom": "jsdom",
        "xmldom": "xmldom",
      /*fabricjs object  for all project files*/
        "caman": "Caman",
        // "jquery": "jQuery",
      /*writing PDF */
        "path": "path",
        "fs": "fs",
        "stream": "stream",   //stream.Writable < pdf
        "pdfkit": "pdfkit"
    },
  ],
  // optimization : {
  //   // minimize: PROD,
  //   minimizer:  [
  //   //   new webpack.UglifyJsPlugin({
  //   //     sourceMap: true
  //   //   })
  //   ]
  // },
  optimization: {
    // minimize: true
    // minimizer: [
    //   new webpack.UglifyJsPlugin({
    //     test: /\.js(\?.*)?$/i,
    //   })
    // //   new webpack.ClosurePlugin(
    // //     {
    // //       // platform: "javascript",
    // //       mode: 'AGGRESSIVE_BUNDLE',
    // /
    // mode: 'STANDARD', // a little misleading -- the actual compilation level is below
    // //       // childCompilations: true
    // //     },
    // //     {
    // //       languageOut: 'ECMASCRIPT5',
    // //       // compilation_level: 'ADVANCED'
    // //     }
    // //   )
    // ],
    // splitChunks: {
    //   minSize: 0
    // },
    // concatenateModules: false
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use:{
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-env']
      //     }
      //   }
      // },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.shader$/i,
        use: 'raw-loader',
      }
    ]
  }
};


if(!PROD) {
  collectInfo(config);
}
if(COPY){
  copyFiles(config);
}
if(WATCH) {
  config.watch = true;
}

webpack(config).run();