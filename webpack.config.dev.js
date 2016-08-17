var path = require('path')
var webpack = require('webpack')
var Dashboard = require('webpack-dashboard')
var DashboardPlugin = require('webpack-dashboard/plugin')


var dashboard = new Dashboard()


module.exports = {
  // The base directory for resolving the entry option
  context: __dirname,
  devtool: 'eval',

  entry: {
    app: 'index',
  },

  // Various output options, to give us a single bundle.js file with everything resolved and concatenated
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: path.join(__dirname, '/assets/'),
    filename: "emitter-extended.dev.js",
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
          loader: 'css?group-css-media-queries!sass'
        })
      },
      */
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [/node_modules/]
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({'process.env': {NODE_ENV: '"development"'}}),
    /**
    new webpack.optimize.CommonsChunkPlugin({name: "vendor",
                                             filename: "vendor.dev.js"}),
    */
    new DashboardPlugin(dashboard.setData),
  ],

  // Include mocks for when node.js specific modules may be required
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
