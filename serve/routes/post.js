const router = require('express').Router();
const {Post, Comment, User, Tag} = require('../mongo');
const F = require('./Factory');


router.get('/error', F(async (req, res, next) => {
  next(new Error("啊啊报错了！"));
}));

/**
 * 任务列表
 */
router.get('/', async (req, res) => {
  const posts = await Post.find();
  console.log('posts', posts)
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
  let tags = req.body.tags && JSON.parse(req.body.tags);
  let newTags;

  // tags存储，新建tags，tags涉及到以后排序管理，增删改查，以及关注度等操作需要单独的表管理。
  if (tags && tags.length) {
    newTags = tags.filter((tag)=>{
      return !tag.tid;
    });

    if (newTags && newTags.length) {
      newTags = await Tag.create(newTags);
      tags = tags.concat(newTags).filter((tag)=>{
        return !!tag.tid
      })
    }
  }

  Object.assign(post, req.body, {creator: req.session.user_id, tags: tags });

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
 * 获取关注用户列表
 *
 * url: /post/:post_id/follows
 * res: {ok:true} 关注成功
 */
router.get('/:post_id/follows', F(async (req, res, next) => {
  const {post_id} = req.params;
  const r = await Post.find({_id: post_id});

  // todo: 返回关注此问题的前50名用户
  res.json({
    success: true, 
    code: 200,
    data: {
      users: [{
        uid: 1,
        nickname: '',
        avatar: '',
        url: ''
      }],
      count: 9
    }
  });
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

  // todo: 关注问题成功，返回用户信息
  res.json({
    success: true, 
    code: 200,
    data: {
      uid: user_id,
      nickname: '',
      avatar: '',
      url: ''
    }});
}));


module.exports = router;
