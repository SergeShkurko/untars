const path = require('path'),
  webpack = require('webpack'),
  BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
  { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin')

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
        baseDir: ['build'],
      },
    }),
    // http://localhost:8888
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
    }),
  )

env === 'production' &&
  plugins.push(
    new UglifyJsPlugin(),
  )

module.exports = {
  entry: {
    bundle: `${__dirname}/src/index.tsx`,
  },
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'assets': path.resolve(__dirname, 'src/assets'),
      'components': path.resolve(__dirname, 'src/components'),
      'i18n': path.resolve(__dirname, 'src/i18n'),
      'ui': path.resolve(__dirname, 'src/ui'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'styles': path.resolve(__dirname, 'src/styles'),
    }
  },

  devtool: env === 'production' ? false : 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
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
          outputPath: 'assets/',
        },
      },
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify(env),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.pug',
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets/locales', to: 'locales' },
      { from: 'src/manifest.json', to: './' },
    ]),
    ...plugins
  ]
}
