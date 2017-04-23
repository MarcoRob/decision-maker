module.exports = {
  entry: './src/App.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      /*{
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]',
        include: path.join(__dirname, 'app')
      },
      {
        test: /\.css$/,
        loader: 'style!css',
        include: path.join(__dirname, 'node_modules')
      },*/
      /*{
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style!css!postcss',

      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]!postcss',
      }*/
    ]
  }
};