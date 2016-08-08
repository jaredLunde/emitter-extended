var path = require('path')
var webpack = require('webpack')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')


module.exports = {
  // The base directory for resolving the entry option
  context: __dirname,

  // The entry point for the bundle
  entry: "lib/index",

  // Various output options, to give us a single bundle.js file with everything resolved and concatenated
  output: {
    path: path.join(__dirname, 'webpack'),
    filename: "emitter-extended.dev.js",
    pathinfo: true
  },

  debug: true,
  devtool: 'source-map',

  // Where to resolve our loaders
  resolve: {
    // Directories that contain our modules
    root: [__dirname],

    // Extensions used to resolve modules
    extensions: ['', '.js', '.react.js', '.scss', '.css']
  },

  module: {
    loaders: [
      {
        test: /\/lib\/.*\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/]
      }
    ],
  },

  plugins: [
    new webpack.DefinePlugin({'process.env': {NODE_ENV: '"development"'}}),
  ],

  // Include mocks for when node.js specific modules may be required
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
