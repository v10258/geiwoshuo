const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'
const argv = require('yargs').argv
const vendorModule = ['jquery', 'babel-polyfill', 'vue', 'vuex', 'axios']

// 文件类型
const getNameByMode = function (type, isDev = false, isChunk = false) {
  const nameType = isChunk ? 'id' : 'name'
  const typeMap = {
    js: 'chunkhash:8',
    css: 'chunkhash:8',
    img: 'hash:8',
    font: 'hash:8'
  }
  let outputName

  if (isDev) {
    outputName = `${type}/[${nameType}].${type}`
  } else {
    outputName = `${type}/[${nameType}]-[${typeMap[type]}].${type}`
  }

  return outputName
}

const config = {
  mode: isDev ? 'development' : 'production',
  entry: {
    'index': './src/index/index.js',
    'task': './src/task/task.js',
    'ask': './src/ask/ask.js',
    'find': './src/find/find.js',
    'contact': './src/contact/contact.js',
    'user': './src/user/user.js',
    'login': './src/login/login.js',
    'setting': './src/setting/setting.js',
    'centre': './src/centre/centre.js',
    'centre-dynamic': './src/centre/centre-dynamic.js',
    'centre-message': './src/centre/centre-message.js',
    'vendor': vendorModule
  },
  output: {
    filename: getNameByMode('js', isDev),
    chunkFilename: getNameByMode('js', isDev, true),
    path: path.resolve(__dirname, 'public/')
  },
  module: {
    rules: [{
      test: /\.s?[ac]ss$/,
      use: [
        MiniCssExtractPlugin.loader,
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
      use: ['babel-loader']
    },
    {
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: getNameByMode('img', isDev),
          publicPath: '../'
        }
      }]
    },
    {
      test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
      use: [{
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: getNameByMode('font', isDev),
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
      name: 'vendor',
      minChunks: Infinity
    }
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),

    new MiniCssExtractPlugin({
      filename: getNameByMode('css', isDev),
      chunkFilename: getNameByMode('css', isDev, true)
    }),

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
const getHtmlConfig2 = function (name, type = 'multi') {
  const {directory, fileName} = parseFileInfo(name)
  const options = {}

  if (type === 'multi') {
    options.chunks = ['vendor', name]
    options.filename = 'template/' + fileName + '.html'
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
    config.plugins.push(new HtmlWebpackPlugin(getHtmlConfig2(page)))
  })
} else {
  const {directory, fileName} = parseFileInfo(argv.define)
  config.entry = {}

  config.entry.vendor = vendorModule
  config.entry[fileName] = path.resolve(__dirname, 'src/', directory, fileName + '.js')
  config.plugins.push(new HtmlWebpackPlugin(getHtmlConfig2(fileName, 'single')))
}

console.log('entry', config.entry)

module.exports = config
