const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './index.js', // Entry point of your application
  output: {
    filename: 'dst/bundle.js', // Output bundle file name
    path: path.resolve(__dirname, ''), // Output directory
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Match JavaScript files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: 'babel-loader', // Use Babel for transpilation
        },
      },
    ],
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};