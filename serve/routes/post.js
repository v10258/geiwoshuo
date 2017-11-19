const router = require('express').Router();
const {Post, Comment, User} = require('../mongo');
const F = require('./Factory');


router.get('/error', F(async (req, res, next) => {
  next(new Error("啊啊报错了！"));
}));

/**
 * 任务列表
 */
router.get('/', async (req, res) => {
  const posts = await Post.find();
  res.json({
    ok: true,
    data: posts
  });
});


/**
 * 添加新任务
 */
router.post('/', async (req, res, next) => {
  const post = new Post();

  // todo: tags 存储
  Object.assign(post, req.body, {creator: req.session.user_id, tags: JSON.parse(req.body.tags)});

  post.created = new Date();

  try {
    const r = await post.save();
    res.redirect('/post/' + r._id);// 跳转到详情页
  } catch (e) {
    next(e);
  }
});

/**
 * 任务详情
 */
router.get('/:post_id', F(async (req, res) => {
  const {post_id} = req.params;
  const post = await Post.findById(post_id);
  const total_subscribed = post.subscribers.length;
  const user_ids = post.subscribers.slice(0, 5);// 最多显示5个

  post.subscribers = null;
  const creator = await User.findById(post.creator, ['name', '_id']);
  const users = user_ids.length ? await User.find({_id: {$in: user_ids}}, ['_id', 'name', 'phone']) : [];
  res.render('post.html', {post, creator, total_subscribed, subscribers: users});
}));

/**
 * 添加评论
 */
router.post('/:post_id/comment', async (req, res, next) => {
  const {post_id} = req.params;
  const post = await Post.findById(post_id);
  if (!post || !post._doc) {
    return next('No post found.');
  }
  const comment = new Comment();
  Object.assign(comment, req.body, {post_id, created: new Date(), creator: 'faker'});

  try {
    const r = await comment.save();
    res.json({
      success: true,
      code: 200,
      data: r
    });
  } catch (e) {
    next(e);
  }
});


const op_field_mapping = {
  'upvote': 'upvotes',
  'downvote': 'downvotes',
  'pageview': 'views',
  'subscribe': {field: 'subscribers', op: '$push'}
};
const ops = Object.keys(op_field_mapping);
/**
 * op:
 * 1. upvote
 * 2. downvote
 * 3. pageview
 *
 */
router.post('/:post_id/op', F(async (req, res, next) => {
  const {post_id} = req.params;
  const {op} = req.body;
  if (!ops.includes(op)) {
    return next(new Error(`Unsupported op: <${op}>`));
  }
  let update;
  if (op === 'subscribe') {
    update = {$push: {[op_field_mapping[op]]: req.session.user_id}}
  } else {
    update = {$inc: {[op_field_mapping[op]]: 1}};
  }
  const post = await Post.findByIdAndUpdate(post_id, update, {new: true});
  res.json(post);
}));

/**
 * 关注问题
 *
 * url: /post/:post_id/subscribe
 * res: {ok:true} 关注成功
 */
router.post('/:post_id/subscribe', F(async (req, res, next) => {
  const {post_id} = req.params;
  const {user_id} = req.session;
  const r = await Post.updateOne({_id: post_id}, {$push: {subscribers: user_id}});
  res.json({success: true, code: 200});
}));


module.exports = router;
