const debug = require('debug')('gws:server');
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
debug('cwd: %o', process.cwd());

const port = process.env.PORT || 3001;
const app = express();

const {Post} = require('./mongo');
const F = require('./routes/Factory');

const user = require('./routes/user');
const post = require('./routes/post');
const auth = require('./routes/auth');

const session = require('./routes/middlewares/session');
// 设置静态文件目录
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session);
app.use('/user', user);
app.use('/post', post);
app.use('/auth', auth);


nunjucks.configure(__dirname + '/templates', {
    autoescape: true,
    noCache: true,// todo 发到生产时，移除此项
    express: app,
    tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '${',
        variableEnd: '}',
        commentStart: '<#',
        commentEnd: '#>'
    }
});


app.get('/', F(async (req, res) => {
    const posts = await Post.findByType('HOT');
    res.render('index.html', {posts, login: !!req.session.user_id});
}));

app.get('/find', function (req, res) {
    res.render('find.html');
});

app.get('/contact', function (req, res) {
    res.render('contact.html');
});

app.get('/login', function (req, res) {
    res.render('login.html');
});

app.get('/ask', F(async (req, res) => {

    res.render('ask.html', {solved: 34256});
}));

app.get('/centre', function (req, res) {
    res.render('centre.html');
});


/**
 * 截获异常，统一处理
 */
app.use((err, req, res, next) => {
    res.status(err.httpCode || 500);
    res.json({
        ok: false,
        err: err.message
    });
});

const server = app.listen(port, () => {
    debug('Server started => %o', JSON.stringify(server.address()));
});

