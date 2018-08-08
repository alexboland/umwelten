const webpack = require('webpack');
const path = require('path');
const config = {
  entry: {
    path: path.join(__dirname, '/client/src'),
    filename: 'app.js'
  },
  output: {
    path: path.resolve(__dirname, 'client/public/javascripts'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  watch: false,
  mode: 'production',
  devtool: "#eval-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test:/\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap&-minimize'
        ]
      },
      {
        test: /\.jsx?/,
        include: path.join(__dirname, '/client/src'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};
module.exports = config;