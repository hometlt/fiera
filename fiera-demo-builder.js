import fs      from 'fs'
import webpack from 'webpack'

const entryDir = "./demos/nymbl-render/"
const entryFile = entryDir + "demo.js"
const targetDir = "./demos/nymbl-render/js/"

const compiler = webpack({
  mode: "development",
  entry: entryFile,
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

            sourceType: "unambiguous",
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-runtime',
              "@babel/plugin-proposal-object-rest-spread",
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-json-strings",
              "@babel/plugin-proposal-export-namespace-from",
              "@babel/plugin-proposal-numeric-separator"
            ],
            comments: false
          }
        }
      }
    ]
  }
})

compiler.run((err, stats) => {

  console.log(stats.toString({
    chunks: false,
    colors: true
  }));

  for(let module of stats.compilation.modules ){
    if(!module.resource || module.resource.includes("/node_modules/") || module.resource === entryFile){
      continue;
    }

    let target = targetDir + module.id.replace(entryDir,"").replace(/^\.\//,"")

    target.split("/").slice(1,-1).reduce((path,curr) => {
      path += curr + "/"
      if(!fs.existsSync(path)){
        console.log(path)
        fs.mkdirSync(path)
      }
      return path;
    },"./")
    fs.copyFileSync(module.id,target)
  }

  let mainText = fs.readFileSync(entryFile, 'utf8');
  mainText = mainText.replace(/\.\.\/\.\.\//g,"./")

  fs.writeFileSync(targetDir + "demo.js", mainText);
})