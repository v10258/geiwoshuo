const nanoid = require('nanoid');
const router = require('express').Router();
const login_required = require('./middlewares/login_requred');
const {User, VerificationCode} = require('../mongo');
const F = require('./Factory');
const crypt = require('../util/crypt');


/**
 * 菜单: 用户
 */
router.get('/', F(async (req, res) => {
  const users = await User.activeUsers();
  res.render('user.html', {activeUsers: users, user: true});
}));

/**
 * 注册新用户
 *
 * 1. 提供手机号和验证码: curl 127.0.0.1:3001/user/signup -d 'phone=12345&code=2314'
 */
router.post('/signup', F(async (req, res, next) => {
  const {account, captcha, code = '123', dataType} = req.body;
  const vc = await VerificationCode.findOne({phone: account, type: 'SIGNUP', code});

  if (!vc) {
    return next('Invalid code.');
  } else {
    await vc.remove();
  }

  const user = Object.assign(new User, {
    phone: account,
    created: new Date
  });

  await user.save();
  req.session.user_id = user._id;

  // ajax 注册
  if (dataType === 'json') {
    res.json({
      success: true,
      code: 200
    })
  // 表单提交
  } else {
    res.redirect('/user');
  }
}));

/**
 * 检查电话或邮箱是否可用
 *
 * 1. 检查电话是否可用: curl '127.0.0.1:3001/user/check?type=phone&value=123453242'
 * 2. 检查邮箱是否可用: curl '127.0.0.1:3001/user/check?type=email&value=youmoo@vellichor.me'
 */
router.get('/check', F(async (req, res, next) => {
  const {type, value} = req.query;
  if (['phone', 'email'].includes(type)) {
    const user = await User.findOne({[type]: value}, ['_id']);
    res.json({success: true, data: {usable: !user}});
  } else {
    next(new Error('Unsupported type: ' + type))
  }
}));

/**
 * 更新我的信息
 */
router.post('/setting/info', login_required, F(async (req, res, next) => {
  const {name, signature} = req.body;
  await req.user.update({$set: {name, signature}});
  res.json({
    success: true,
    code: 200
  });
}));

router.post('/login', F(async (req, res, next) => {
  const {account = '', password, captcha, code, dataType} = req.body;

  let query;
  if (/^\d+$/.test(account)) {
    query = {phone: account};
  } else if (account.includes('@')) {
    query = {email: account};
  } else {
    return next(new Error('Unsupported account: ' + account));
  }
  const user = await User.findOne(query);
  if (!user) {
    return next(new Error('User not found.'));
  }
  if (false && !(await crypt.test(password, user.password))) {// todo 暂时不校验密码
    return next(new Error('Username or password is incorrect.'));
  }
  req.session.user_id = user._id;

  // ajax 登录
  if (dataType === 'json') {
    res.json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        avatar: user.avatar
      },
      code: 200
    })
  // 表单提交
  } else {
    res.redirect('/');
  }
}));


router.get('/logout', F(async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
}));

/**
 * 获取用户列表
 */
router.get('/list', F(async (req, res, next) => {
  const users = await User.find({});
  res.json(users);
}));

/**
 * 获取单个用户的详情
 */
router.get('/:id', F(async (req, res, next) => {
  return await User.findById(req.params.id);
}));

/**
 * 个人中心
 */
router.get('/:id/centre', F(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error('User not found.');
    error.httpCocde = 404;
    return next(error)
  }
  res.render('centre.html', {
    upvotes: user.upvotes || 0,
    subscribed: user.subscribed.length,
    fans: user.fans.length
  });
}));

module.exports = router;
