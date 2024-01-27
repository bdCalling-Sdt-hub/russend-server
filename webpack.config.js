const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/server.js', // Entry point of your server code
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output file name
  },
  target: 'node', // Important to set the target as 'node' for server-side code
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use babel-loader to transpile your code
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
