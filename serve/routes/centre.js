const nanoid = require('nanoid');
const router = require('express').Router();
const login_required = require('./middlewares/login_requred');
const {User, VerificationCode} = require('../mongo');
const F = require('./Factory');
const crypt = require('../util/crypt');


/**
 * 我的动态 - 个人中心
 */
router.get('/', F(async (req, res, next) => {
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

/**
 * 我的问题
 */
router.get('/question', F(async (req, res, next) => {
  let userId = req.session.user_id;
  const posts = await Post.findByUser(userId);

  res.render('centre-question.html', {posts});
}));

/**
 * 获取单个用户的详情
 */
router.get('/:id', F(async (req, res, next) => {
  return await User.findById(req.params.id);
}));


module.exports = router;
