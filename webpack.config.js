// https://hackernoon.com/webpack-3-quickstarter-configure-webpack-from-scratch-30a6c394038a

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const extractPlugin = new ExtractTextPlugin({
  filename: './assets/css/app.css'
});

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    app: './app.js'
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      'game-modules': path.resolve(__dirname, "src/assets/js/first-phaser-game/modules"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env']
          }
        }
      },
      { test: /\.html$/, use: ['html-loader'] },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src', 'assets', 'scss')],
        use: extractPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      //file-loader(for images)
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './assets/media/'
            }
          }
        ]
      },
      //file-loader(for fonts)
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    extractPlugin,
    new CopyWebpackPlugin([
      { context: 'assets/media/', from: '**', to: 'assets/media/' }
    ])
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "dist/assets/media"),
    stats: 'errors-only',
    open: true,
    port: 12000,
    compress: true
  },
  devtool: 'inline-source-map'
}