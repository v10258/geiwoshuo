/*!
 * blog-mex.js
 * @date 2015.12.6
 * @author chenjinghui@meizu.com
 * @version 0.0.1
 */

var path = require('path');

var express = require('express');
var nunjucks = require('nunjucks');
var app = express();

// 设置静态文件目录
app.use(express.static(__dirname + '/public'));

nunjucks.configure('serve/views', {
  autoescape: true,
  express: app,
  tags: {
    blockStart: '<%',
    blockEnd: '%>',
    variableStart: '<$',
    variableEnd: '$>',
    commentStart: '<#',
    commentEnd: '#>'
  }
});


app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/find', function(req, res) {
  res.render('find.html');
});

app.get('/contact', function(req, res) {
  res.render('contact.html');
});

app.get('/ask', function(req, res) {
  res.render('ask.html');
});

app.get('/centre', function(req, res) {
  res.render('centre.html');
});

app.get('/task/:id', function(req, res) {
  res.render('task.html');
});

var server = app.listen(3000, function () {
  var host = server.address().address || 'localhost';
  var port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});

// // 引入依赖
// var http = require('http');
// var path = require('path');
// var fs = require('fs');

// var express = require('express');
// var express = require('nunjucks');
// var errorHandler = require('errorhandler');

// var config = require('./config.js');

// // 实例化express
// var app = express();

// var environment = process.env.NODE_ENV || 'development';
// var configOptions = config[environment];


// // All environments Settings
// app.set('port', process.env.PORT || 3000);

// // 设置静态文件目录
// app.use(express.static(__dirname + '/public'));

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// // Development only
// if ('development' === app.get('env')) {
//   app.use(errorHandler());
// }

// // 定制 404 页面
// app.use(function(req, res) {
//     res.type('text/plain');
//     res.status(404);
//     res.send('404 - Not Found');
// });
// // 定制 500 页面
// app.use(function(err, req, res, next) {
//     console.error(err.stack);
//     res.type('text/plain');
//     res.status(500);
//     res.send('500 - Server Error');
// });

// // 监听服务器端口
// app.listen(configOptions.server.port, function() {
//     console.log('Express started on http://localhost:' +
//         app.get('port') + '; press Ctrl-C to terminate.');
// });