const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const argv = require('yargs').argv
const vendorModule = ['jquery', 'vue', 'vuex', 'axios', 'mock']

const config = {
  mode: 'development',
  entry: {
    'index': './src/index/index.js',
    'task': './src/task/task.js',
    'ask': './src/ask/ask.js',
    'find': './src/find/find.js',
    'contact': './src/contact/contact.js',
    'user': './src/user/user.js',
    'centre': './src/centre/centre.js',
    'login': './src/login/login.js',
    'setting': './src/setting/setting.js',
    'centre-dynamic': './src/centre/centre-dynamic.js',
    'vendor': vendorModule
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'public/')
  },
  module: {
    rules: [{
      test: /\.s?[ac]ss$/,
      use: [
        //MiniCssExtractPlugin.loader,
        'style-loader',
        'css-loader',
        'resolve-url-loader',
        'postcss-loader?sourceMap',
        'sass-loader?sourceMap'
      ]
    }, {
      test: /\.ejs$/,
      use: ['ejs-do-loader']
    },
    {
      test: /\.vue$/,
      use: ['vue-loader']
    },
    {
      test: /\.js$/,
      use: 'babel-loader'
    },
    {
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[ext]',
          publicPath: '../'
        }
      }]
    },
    {
      test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
      use: [{
        loader: 'file-loader',
        options: {
          limit: 1000,
          name: 'font/[name].[ext]',
          publicPath: '../'
        }
      }]
    }]
  },
  resolve: {
    alias: {
      mock: path.resolve(__dirname, 'src/common/js/mock/mock.js'),
      vue: 'vue/dist/vue.js'
    }
  },

  optimization: {
    splitChunks: {
      name: 'vendor'
    }
    // runtimeChunk: {
    //   name: 'manifest'
    // }
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),

    // new MiniCssExtractPlugin({
    //   filename: 'css/[name].css',
    //   chunkFilename: '[id].css'
    // }),

    new VueLoaderPlugin(),

    new CopyWebpackPlugin([
      { from: 'node_modules/bootstrap/dist/css', to: 'vendor/bootstrap/css/' },
      { from: 'node_modules/tinymce/plugins', to: 'js/plugins' },
      { from: 'node_modules/tinymce/themes', to: 'js/themes' },
      { from: 'node_modules/tinymce/skins', to: 'js/skins' }
    ])
  ]
}

// 解析子目录和文件名
const parseFileInfo = function (fileName) {
  let directory = fileName
  const moduleNameParse = fileName.split('-')

  if (moduleNameParse && moduleNameParse.length === 2) {
    directory = moduleNameParse[0]
  }

  return {
    directory,
    fileName
  }
}

// 获取html-webpack-plugin参数
const getHtmlConfig = function (name, type = 'multi') {
  const {directory, fileName} = parseFileInfo(name)
  const options = {}

  if (type === 'multi') {
    options.chunks = ['vendor', name]
    options.filename = fileName + '.html'
  }

  options.template = path.resolve(__dirname, 'src/', directory, `${fileName}.ejs`)
  return options
}

// 未指定模块，构建全部
if (!argv.define) {
  const cloneEntry = {...config.entry}
  delete cloneEntry.vendor
  const pages = Object.keys(cloneEntry)

  pages.forEach(page => {
    config.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(page)))
  })
} else {
  const {directory, fileName} = parseFileInfo(argv.define)
  config.entry = {}

  config.entry.vendor = vendorModule
  config.entry[fileName] = path.resolve(__dirname, 'src/', directory, fileName + '.js')
  config.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(fileName, 'single')))
}

console.log('entry', config.entry)

module.exports = config
