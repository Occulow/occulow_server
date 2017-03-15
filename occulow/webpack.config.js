var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'static/occulow/js/dist');
var APP_DIR = path.resolve(__dirname, 'static/occulow/js/src');

var config = {
  entry: path.resolve(APP_DIR,'index.jsx'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
        {
            test: /\.jsx?/,
            include: APP_DIR,
            loader: 'babel-loader'
        }
    ]
  }
};

module.exports = config;