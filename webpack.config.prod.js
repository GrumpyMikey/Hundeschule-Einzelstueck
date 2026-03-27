const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
          globOptions: {
            ignore: ['**/.DS_Store'],
          },
        },
        {
          from: '*.html', to: '[name].html',
          filter: (resourcePath) => !resourcePath.endsWith('index.html')
        },
        { from: 'js/vendor', to: 'js/vendor', noErrorOnMissing: true },
        { from: 'CNAME', noErrorOnMissing: true },
        { from: 'robots.txt', noErrorOnMissing: true },
        { from: 'sitemap.xml', noErrorOnMissing: true },
        { from: 'send-mail.php', noErrorOnMissing: true },
        { from: 'site.webmanifest', noErrorOnMissing: true },
      ],
    }),
  ],
});
