const debug = require('debug')('gws:server');
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const captcha = require('trek-captcha');
debug('cwd: %o', process.cwd());

const port = process.env.PORT || 3001;
const app = express();

const { Post, User, Tag, Captcha, PageLog } = require('./mongo');
const F = require('./routes/Factory');

const user = require('./routes/user');
const post = require('./routes/post');
const auth = require('./routes/auth');
const tag = require('./routes/tag');
const file = require('./routes/file');
const code = require('./routes/code');
const centre = require('./routes/centre');
const setting = require('./routes/setting');

const session = require('./routes/middlewares/session');

// 设置静态文件目录
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session);
app.use((req, res, next) => {
  res.locals.user_id = req.session.user_id;
  res.locals.logged_in = !!req.session.user_id;
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  const log = Object.assign(new PageLog(), {
    method: req.method,
    path: req.path,
    type: req.headers[ 'content-type' ],
    ua: req.headers[ 'User-Agent' ],
    ip: req.headers[ 'x-forwarded-for' ] || req.connection.remoteAddress,
    user_id: req.session.user_id || '-1', // -1 表示未登录用户
    created: new Date(),
    duration
  });
  log.save().catch(console.log); // 异步试试
});
app.use('/user', user);
app.use('/post', post);
app.use('/auth', auth);
app.use('/tag', tag);
app.use('/file', file);
app.use('/code', code);
app.use('/centre', centre);
app.use('/setting', setting);

nunjucks.configure(__dirname + '/templates', {
  autoescape: true,
  noCache: true, // todo 发到生产时，移除此项
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
  const postCount = await Post.count();
  const posts = await Post.findByType('HOT');

  // todo: 暂用简单查询
  const hotTags = await Tag.find().limit(10);

  const creators = posts.map(p => p.creator);
  const users = (await User.fetchAvatars(creators)).reduce((p, v) => (p[ v.id ] = v.avatar, p), {});
  const postsToUse = posts.map(p => {
    if (users[ p.creator ]) {
      return Object.assign(p.toObject(), { creatorAvatar: users[ p.creator ] });
    }
    return p;
  });

  res.render('index.html', { posts: postsToUse, postCount, hotTags, home: true });
}));

app.get('/find', function (req, res) {
  res.render('find.html', { find: true });
});

app.get('/contact', function (req, res) {
  res.render('contact.html', { contact: true });
});

app.get('/login', function (req, res) {
  res.render('login.html');
});

app.get('/ask', F(async (req, res) => {
  console.log('', req.session && req.session.user_id);
  res.render('ask.html', { solved: 34256, post: {}, isLogin: !!(req.session && req.session.user_id) });
}));

app.get('/edit/:post_id', F(async (req, res) => {
  const { post_id } = req.params;
  const post = await Post.find({ _id: post_id });
  res.render('ask.html', { solved: 34256, post: post[ 0 ], isLogin: !!(req.session && req.session.user_id) });
}));

app.get('/captcha', F(async (req, res) => {
  const { token, buffer } = await captcha({ size: 4 });
  const capt = new Captcha();
  capt.token = token;
  capt.created = new Date();
  await capt.save();

  res.header('captcha_id', capt.id);
  res.json({
    success: true,
    code: 200,
    data: {
      captcha: 'data:image/gif;base64,' + buffer.toString('base64')
    },
    message: ''
  });
}));
app.get('/daily_uv', (req, res, next) => {
  PageLog.dailyUserViews(new Date())
    .then(uv => {
      res.json({
        success: true,
        code: 200,
        data: {
          uv
        }
      });
    })
    .catch(next);
});

/**
 * 截获异常，统一处理
 */
app.use((err, req, res, next) => {
  const code = err.httpCode || 500;
  res.status(code);
  res.json({
    success: false,
    message: err.message || err,
    code
  });
});

const server = app.listen(port, () => {
  debug('Server started => %o', JSON.stringify(server.address()));
});

