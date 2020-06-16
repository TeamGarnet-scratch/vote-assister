const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//  minicssExtractPlugin

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [' ', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new CleanWebpackPlugin(),
  ],
};
