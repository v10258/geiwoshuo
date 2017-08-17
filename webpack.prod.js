const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const argv = require('yargs').argv;
let isProduction = process.env.NODE_ENV === 'production';

// 构建目录，构建入口, 如果没有子目录 index 改为空字符串即可
var submodule = argv.define || 'index';
var entryFileName = submodule;

var outputPath = path.resolve(__dirname, 'dist/', submodule);
var entryPath = path.resolve(__dirname, 'src/', submodule, entryFileName + '.js');

var config = {
  entry: {
    vendor: ['lodash']
  },
  output: {
    filename: 'js/[name]-[chunkhash:8].js',
    path: outputPath
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    },{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'autoprefixer-loader','resolve-url-loader', 'sass-loader?sourceMap']
      })
    },{
      test: /\.ejs$/,
      use: 'ejs-compiled-loader'
    }, {
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
  plugins: [
    // 页面集成
    new HtmlWebpackPlugin({
      template: path.resolve('src/', submodule, entryFileName + '.ejs')
    }),
    // 抽出样式
    new ExtractTextPlugin(entryFileName + '-[chunkhash:8].css'),
    // 抽出公共文件vendor依赖，manifest运行时信息
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),
    // 定义组件内环境变量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // 代码压缩优化        
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    }),
    // 文件清单
    new ManifestPlugin()
  ]
};
config.entry[entryFileName] = entryPath;

console.log('entry', path.resolve(__dirname, 'src/', submodule, entryFileName + '.js'));
console.log('template', path.resolve('src/', submodule, entryFileName + '.ejs'));

module.exports = config;
