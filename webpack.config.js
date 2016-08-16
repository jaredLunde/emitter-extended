var path = require('path')
var webpack = require('webpack')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')



var stripLogger = 'strip-loader?strip[]=logger.green,' +
                               'strip[]=logger.red,' +
                               'strip[]=logger.blue,' +
                               'strip[]=logger.orange,' +
                               'strip[]=logger.warn,' +
                               'strip[]=logger.success,' +
                               'strip[]=logger.error,' +
                               'strip[]=console.error,' +
                               'strip[]=logger.log,' +
                               'strip[]=logger.print,' +
                               'strip[]=withPerf'


module.exports = {
  // The base directory for resolving the entry option
  context: __dirname,

  entry: {
    app: 'index.js',
  },

  // Various output options, to give us a single bundle.js file with everything resolved and concatenated
  output: {
    path: path.join(__dirname, '/dist'),
    filename: "emitter-extended.js",
    pathinfo: true
  },

  // Where to resolve our loaders
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  resolve: {
    // Directories that contain our modules
    modules: [path.resolve(__dirname, "lib"), "node_modules"],
    descriptionFiles: ["package.json"],
    moduleExtensions: ["-loader"],
    // Extensions used to resolve modules
    extensions: ['', '.js', '.scss', '.css']
  },

  module: {
    loaders: [
      /*
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css?minifier!group-css-media-queries!sass'
        })
      },
      */
      {
        test: /\.js$/,
        loaders: ['babel-loader', stripLogger, stripLogger],
        exclude: [/node_modules/]
      }
    ],
  },

  plugins: [
    new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}),
    /**
    new webpack.optimize.CommonsChunkPlugin({name: "vendor",
                                             filename: "vendor.js"}),
    */
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    /* new ExtractTextPlugin('emitter-extended.css') */
  ],

  // Include mocks for when node.js specific modules may be required
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
