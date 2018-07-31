const path = require('path'),
  webpack = require('webpack'),
  BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin')

const env = process.env.NODE_ENV,
  plugins = []

env === 'development' &&
  plugins.push(
    // http://localhost:3000
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      open: false,
      server: {
        baseDir: ['development'],
      },
    }),
  )

module.exports = {
  entry: {
    bundle: `${__dirname}/markup/static/js/main.js`,
  },
  output: {
    path: `${__dirname}/${env}`,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      'components': path.resolve(__dirname, 'markup/components'),
      'pages': path.resolve(__dirname, 'markup/pages'),
      'static': path.resolve(__dirname, 'markup/static'),
    }
  },

  devtool: env === 'production' ? false : 'source-map',

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /.pug$/,
        loader: 'pug-loader',
      },
      {
        test: /\.(ico|svg|png|jpg|gif|mp4|mov|pdf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/assets/',
        },
      },
      {
        test: /.styl$/,
        loader: 'style-loader/url!css-loader!stylus-loader',
      },
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify(env),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './markup/pages/404.pug',
    }),
    new CopyWebpackPlugin([
      { from: 'markup/static', to: 'static' },
    ]),
    ...plugins
  ]
}
