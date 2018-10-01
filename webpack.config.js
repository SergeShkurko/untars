const fs = require('fs'),
  path = require('path'),
  webpack = require('webpack'),
  autoprefixer = require('autoprefixer-stylus'),
  rupture = require('rupture'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  WebpackBuildNotifierPlugin = require('webpack-build-notifier'),
  config = require('./config')

const mode = process.env.NODE_ENV,
  isLocalDevelopment = process.argv.join('|').includes('webpack-dev-server'),
  plugins = []

const utils = {
  /**
   * Формирование конфигураций страниц для
   * их дальнейшей сборки
   */
  pages: fs.readdirSync('./markup/pages/')
    .filter((fileName) => fileName.indexOf('template') < 1)
    .map((fileName) => ({
      filename: fileName.replace('pug', 'html'),
      template: `./markup/pages/${fileName}`,
    })),
  /**
   * Формирование путей для копирования ресурсов,
   * расположенных в компонентах
   */
  componentsAssets: fs.readdirSync('./markup/components/')
    .filter((componentName) => fs.existsSync(`./markup/components/${componentName}/assets/`))
    .map((componentName) => ({
      from: `./markup/components/${componentName}/assets/`,
      to: `./static/img/assets/${componentName}/`,
    })),
}

isLocalDevelopment &&
  plugins.push(
    new WebpackBuildNotifierPlugin(config.notify)
  )

module.exports = {
  mode,
  entry: {
    bundle: `${__dirname}/markup/static/js/main.js`,
  },
  output: {
    path: `${__dirname}/${mode}`,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', 'jsx', '.json'],
    alias: {
      'components': path.resolve(__dirname, 'markup/components'),
      'pages': path.resolve(__dirname, 'markup/pages'),
      'static': path.resolve(__dirname, 'markup/static'),
    }
  },

  devtool: mode === 'production' ? false : 'source-map',

  performance: {
    hints: mode === 'production' ? 'warning' : false
  },

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
        loader: [
          MiniCssExtractPlugin.loader,
          'css-loader?-url',
          {
            loader: 'stylus-loader',
            options: {
              use: [
                autoprefixer(),
                rupture(),
              ],
            },
          },
        ],
      },
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_ENV': JSON.stringify(mode),
    }),
    ...utils.pages.map((page) => new HtmlWebpackPlugin(page)),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin([
      { from: 'markup/static/fonts', to: 'static/fonts' },
      { from: 'markup/static/img', to: 'static/img' },
      { from: 'markup/static/misc', to: '.' },
      ...utils.componentsAssets,
    ]),
    ...plugins,
  ],

  devServer: config.devServer,
}
