import webpack from 'webpack'

let config = {
  mode: "development",
  devtool: 'none',
  entry:  './src/svg2pdf.ts',
  output: {
    filename: "svg2pdf-bundle.js",
    library: "svg2pdf",
    libraryTarget: 'var'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
      }
    ]
  }
}

const compiler = webpack(config);

compiler.run((err, stats) => {
  console.log(stats.toString({
    chunks: false,
    colors: true
  }));
})