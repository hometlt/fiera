import path    from 'path'
import fs      from 'fs'
import webpack from 'webpack'

const directory = "./demos/arc-text/"


    // {
    //     mode: "development",
    //     devtool: 'none',
    //     entry:   directory + "extensions.js",
    //     output: {
    //       path:       path.resolve(directory + "js/"),
    //       filename:   "extensions-esnext.js"
    //     },
    //     module: {
    //       rules: [
    //         {
    //           test: /\.js$/,
    //           exclude: /node_modules/,
    //           use: {
    //             loader: 'babel-loader',
    //             options: {
    //                 "presets": ["babel-preset-next",{modules: false}]
    //             }
    //           }
    //         }
    //       ]
    //     }
    // },

let entry = directory + "demo.js";
const compiler = webpack({
  mode: "development",
  devtool: 'none',
  entry:   entry,
  // output: {
  //   path:       path.resolve(directory + "js/"),
  //   filename:   "extensions-es2015.js"
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:{
          loader: 'babel-loader',
          options: {
            plugins: [
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-transform-runtime",
              ["@babel/plugin-proposal-class-properties", { "loose": true }]
            ],
            sourceType: "unambiguous",
            presets: [
              [
                "@babel/preset-env",
                {
                  "modules": false,
                  "useBuiltIns": "usage",
                  "targets": "> 0.25%, not dead",
                  "corejs": 3,
                  "loose": true
                }
              ]
            ]
          }
        }
      }
    ]
  }
})

compiler.run((err, stats) => {
    // let esNextStats = multiStats.stats[0];
    // let es2015Stats = multiStats.stats[1];

  // console.log(esNextStats.toString({
  //   chunks: false,
  //   colors: true
  // }));

  // console.log(es2015Stats.toString({
  //   chunks: false,
  //   colors: true
  // }));

  console.log(stats.toString({
    chunks: false,
    colors: true
  }));

  let modules = stats.compilation.modules.map(m => m.id)
      .filter(m => !m.includes("/node_modules/"))
      .filter(m => m !== entry)

  modules.forEach(module => {

    let target = directory + "js/" + module.replace(/^\.\//,"")

    target.split("/").slice(1,-1).reduce((path,curr) => {
      path += curr + "/"
      if(!fs.existsSync(path)){
        fs.mkdirSync(path)
      }
      return path;
    },"./")
    fs.copyFileSync(module,target)
  })

  let mainText = fs.readFileSync(entry, 'utf8');
  mainText = mainText.replace(/\.\.\/\.\.\//g,"./")

  fs.writeFileSync(directory + "js/demo.js", mainText);
})