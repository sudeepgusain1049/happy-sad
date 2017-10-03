var ExtractTextPlugin = require("extract-text-webpack-plugin"),
webpack = require('webpack'),
path = require('path');

module.exports = {
  cache : false,
  //debug : true,
  //devtool : 'source-map',
  entry: './app/main.js',
  output: {
    path: path.join(__dirname, "/app"),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    inline: true,
    contentBase: './app',
    host: '0.0.0.0',
    historyApiFallback: true,
    disableHostCheck: true,
    port: 8100
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'react','stage-2']
        }
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      }
    ]
  },
  plugins: [new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("./css/style.css")]
}
