const nanoid = require('nanoid');
const router = require('express').Router();
const {User} = require('../mongo');
const F = require('./Factory');
const crypt = require('../util/crypt');


/**
 * 菜单: 用户
 */
router.get('/', F(async (req, res) => {
  const users = await User.activeUsers();
  res.render('user.html', {activeUsers: users});
}));

/**
 * 注册新用户
 */
router.post('/signup', F(async (req, res, next) => {
  const {phone, code = '123', captcha} = req.body;

  // todo 校验 手机短信及验证码

  const user = Object.assign(new User, {
    phone,
    created: new Date
  });

  await user.save();
  req.session.user_id = user._id;

  res.redirect('/user');
}));

/**
 * 检查电话或邮箱是否可用
 */
router.get('/check', F(async (req, res, next) => {
  const {type, value} = req.query;
  if (['phone', 'email'].includes(type)) {
    const user = await User.findOne({[type]: value}, ['_id']);
    res.json({ok: true, usable: !user});
  } else {
    next(new Error('Unsupported type: ' + type))
  }
}));

router.post('/login', F(async (req, res, next) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return next(new Error('User not found.'));
  }
  if (!(await crypt.test(password, user.password))) {
    return next(new Error('Username or password is incorrect.'));
  }
  req.session.user_id = user._id;
  req.session.save();
  res.json({ok: true});
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

module.exports = router;
