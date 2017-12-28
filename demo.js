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

nunjucks.configure(__dirname + '/public/template', {
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

app.get('/user', function(req, res) {
  res.render('user.html');
});

app.get('/login', function(req, res) {
  res.render('login.html');
});

app.get('/ask', function(req, res) {
  res.render('ask.html');
});

app.get('/centre', function(req, res) {
  res.render('centre.html');
});

app.get('/post/:id', function(req, res) {
  res.render('task.html');
});

app.get('/setting', function(req, res) {
  res.render('setting.html');
});

var server = app.listen(3000, function () {
  var host = server.address().address || 'localhost';
  var port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});