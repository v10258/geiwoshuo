const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const argv = require('yargs').argv;
var isProduction = process.env.NODE_ENV === 'production';

// 构建目录，构建入口, 如果没有指定模块则默认全部模块
var activeModule = argv.define || 'all';
var modules = ['index', 'task', 'ask', 'find', 'contact', 'user', 'centre', 'login', 'setting'];

var outputPath = path.resolve(__dirname, 'public/');

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
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
      })
    }, {
      test: /\.ejs$/,
      use: 'ejs-compiled-loader'
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          'js': 'babel-loader',
          'scss': 'vue-style-loader!css-loader!sass-loader',
          'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
        }
      }
    },
    {
      test: /\.js$/,
      use: 'babel-loader'
    }, {
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]',
          publicPath: '../',
          outputPath: 'img/'
        }
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: '[name].[ext]',
          publicPath: '../',
          outputPath: 'font/'
        }
      }]
    }]
  },
  resolve: {
    alias: {
      mock: path.resolve(__dirname, 'src/common/js/mock/mock.js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: ['popper.js', 'default']
    }),
    new CopyWebpackPlugin([
      { from: 'node_modules/bootstrap/dist/css', to: 'vendor/bootstrap/css/' },
      { from: 'node_modules/tinymce/plugins', to: 'js/plugins' },
      { from: 'node_modules/tinymce/themes', to: 'js/themes' },
      { from: 'node_modules/tinymce/skins', to: 'js/skins' }
    ]),
    // 抽出样式
    new ExtractTextPlugin({
      filename: 'css/[name].css'
    }),
    // 抽出公共文件vendor依赖，manifest运行时信息
    new webpack.optimize.CommonsChunkPlugin({
      //name: ['vendor', 'manifest']
      name: 'vendor',
      minChunks: Infinity,
    }),
    // 定义组件内环境变量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};

console.log('activeModule', activeModule)
if (activeModule === 'all') {
  modules.forEach((n, i) => {
    config.entry[n] = path.resolve(__dirname, 'src/', n, n + '.js');

    // //页面集成
    config.plugins.push(new HtmlWebpackPlugin({
      chunks: ['vendor',n],
      template: path.resolve(__dirname, 'src/', n, n + '.ejs'),
      filename: 'template/' + n + '.html'
    }));

    console.log('entry', path.resolve(__dirname, 'src/', n, n + '.js'));
  })
} else {
  config.entry[activeModule] = path.resolve(__dirname, 'src/', activeModule, activeModule + '.js');

  //页面集成
  config.plugins.push(new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/', activeModule, activeModule + '.ejs'),
    filename: 'template/' + activeModule + '.html'
  }));
  console.log('entry', path.resolve(__dirname, 'src/', activeModule, activeModule + '.js'));
}

module.exports = config;
