const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const argv = require('yargs').argv;

// 构建目录，构建入口, 如果没有子目录 index 改为空字符串即可
var submodule = argv.define || 'index';
var entryFileName = submodule;

var outputPath = path.resolve(__dirname, 'dist/', submodule);
var entryPath = path.resolve(__dirname, 'src/', submodule, entryFileName + '.js');

var config = {
  entry: {
    entry: entryPath,
    vendor: ['lodash']
  },
  output: {
    filename: 'js/[name].js',
    path: outputPath
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'autoprefixer-loader']
    },{
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'autoprefixer-loader', 'sass-loader']
    },{
      test: /\.ejs$/,
      use: ['ejs-compiled-loader']
    },{
      test: /\.js$/,
      use: 'babel-loader'
    }, {
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: 'img/[name].[ext]'
        }
      }]
    },{
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: 'font/[name].[ext]'
        }
      }]
    }]
  },
  plugins: [
    // 页面集成
    new HtmlWebpackPlugin({
      template: path.resolve('src/', submodule, entryFileName + '.ejs')
    }),
    // 抽出公共文件vendor依赖，manifest运行时信息
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),
    // 模块热更新
    new webpack.HotModuleReplacementPlugin()
  ],
  // 本地开发服务配置，代理配置
  devServer: {
    hot: true,
    inline: true,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};

console.log('entry', path.resolve(__dirname, 'src/', submodule, entryFileName + '.js'));
console.log('template', path.resolve('src/', submodule, entryFileName + '.ejs'));

module.exports = config;