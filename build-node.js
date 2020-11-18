import path from 'path'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dateString = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

let config = {
        mode: "development",
        devtool: 'none',
        plugins: [
            new webpack.ProvidePlugin({}),
            new webpack.BannerPlugin({
                banner: `Fiera.js. Set of tool for FabricJS library.\n@author Denis Ponomarev <ponomarevtlt@gmail.com>\n@date ${dateString}`
            }),
            new webpack.DefinePlugin({
                DEVELOPMENT: false
            })
        ],
        entry: {
            // fieraNode: ["@babel/polyfill",'./src/fiera.node.js']
            fieraNode: './src/fiera.node.js'
        },
        output: {
            libraryTarget: 'umd',
            libraryExport: 'default',
            path: path.resolve(__dirname, "./dist"),
            filename: "fiera-node.js"
        },
        target: "node",
        externals: [
            // "fs",
            // "path",
            "request",
            // "stream",
            // "d3",
            "jsdom",
            "canvas",
            'jsdom/lib/jsdom/living/generated/utils.js',
            'jsdom/lib/jsdom/utils.js',
            'jsdom/lib/jsdom/browser/resources/resource-loader.js',
            "gl",
            "gifencoder",
            "whammy",
            "image-type",
            // "zlib",
            "crypto-js",
            "fontkit",
            "events",
            "linebreak",
            "png-js",
            "pngjs",
            // "atob",
            // {
            //   "canvas": "commonjs canvas"
            // },
            // "utf-8-validate",
            // "bufferutil"
            nodeExternals()
        ],
        // module: {
        // rules: [
        // {
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   use:{
        //     loader: 'babel-loader',
        //     options: {
        //       "plugins": [
        //         "@babel/plugin-syntax-dynamic-import",
        //         "@babel/plugin-transform-runtime",
        //         ["@babel/plugin-proposal-class-properties", { "loose": true }]
        //       ],
        //       "sourceType": "unambiguous",
        //       "presets": [
        //         [
        //           "@babel/preset-env",
        //           {
        //             "modules": "false",
        //             "useBuiltIns": "usage",
        //             "targets": "> 0.25%, not dead",
        //             "corejs": 3
        //           }
        //         ]
        //       ]
        //     }
        //   }
        // },
        // {
        //   test: /\.(png|jpg|gif)$/i,
        //   use: [
        //     {
        //       loader: 'url-loader',
        //       options: {
        //         limit: 8192,
        //       },
        //     },
        //   ],
        // },
        // {
        //   test: /\.afm/,
        //   loader: 'raw-loader'
        // },
        // {
        //   test: /\.svg$/,
        //   loader: 'svg-inline-loader'
        // }
        // ]
        // }
    };

const compiler = webpack(config);

compiler.run((err, stats) => {

    console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true    // Shows colors in the console
    }));
});