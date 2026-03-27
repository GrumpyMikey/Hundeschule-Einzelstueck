const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // DIESE ZEILE FEHLT

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, './'), // Erlaubt Zugriff auf Bilder/CSS im Root
    },
    hot: true,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true // Hier MUSS inject true sein, damit er das JS/CSS einfügt
    })
  ]
});



