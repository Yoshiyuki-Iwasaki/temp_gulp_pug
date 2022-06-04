const webpack = require('webpack');
const Uglify = require("uglifyjs-webpack-plugin");
let path = require('path');

module.exports = {
  entry: ['./source/src/js/main.js'],
  output : {
    filename    : 'script.js',
    path        : path.resolve(__dirname, 'dist/assets/js')
  },
  mode: 'production', // 'production'で圧縮
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ["@babel/preset-env", {
                  targets: {
                    ie: "11"
                  },
                  useBuiltIns: "usage"
                }]
              ]
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
};