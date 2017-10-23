const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const argv = require('yargs').argv;

let isProduction = process.env.NODE_ENV === 'production';

// 构建目录，构建入口, 如果没有子目录 index 改为空字符串即可
var submodule = argv.define || 'index';
var entryFileName = submodule;

var outputPath = path.resolve(__dirname, 'public/', submodule);
var entryPath = path.resolve(__dirname, 'src/', submodule, entryFileName + '.js');

var config = {
  entry: {
    vendor: ['jquery', 'popper.js', 'bootstrap']
  },
  output: {
    filename: 'js/[name].js',
    path: outputPath
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },{
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'autoprefixer-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
    },{
      test: /\.ejs$/,
      use: ['ejs-compiled-loader']
    },{
      test: /\.js$/,
      use: 'babel-loader'
    },{
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name]-[hash:8].[ext]',
          useRelativePath: isProduction
        }
      }]
    },{
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: '[name]-[hash:8].[ext]',
          useRelativePath: isProduction
        }
      }]
    }]
  },
  // externals: {
  //   'jQuery': 'window.$',
  //   'Popper': 'window.Popper'
  // },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: ['popper.js', 'default']
    }),
    new CopyWebpackPlugin([
      { from: 'node_modules/bootstrap/dist/css', to: 'vendor/bootstrap/css/'}
    ]),
    // 页面集成
    new HtmlWebpackPlugin({
      template: path.resolve('src/', submodule, entryFileName + '.ejs')
    }),
    // 抽出公共文件vendor依赖，manifest运行时信息
    new webpack.optimize.CommonsChunkPlugin({
      //name: ['vendor', 'manifest']
      name: 'vendor'
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
config.entry[entryFileName] = entryPath;

console.log('entry', path.resolve(__dirname, 'src/', submodule, entryFileName + '.js'));
console.log('template', path.resolve('src/', submodule, entryFileName + '.ejs'));

module.exports = config;