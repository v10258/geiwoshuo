const R = require('ramda');
const router = require('express').Router();
const { Post, Comment, User, Tag } = require('../mongo');
const F = require('./Factory');
const login_required = require('./middlewares/login_requred');


router.get('/error', F(async (req, res, next) => {
  next(new Error('啊啊报错了！'));
}));

/**
 * 任务列表
 */
router.get('/query', async (req, res) => {
  //const posts = await Post.find();
  const querys = req.query;
  const posts = await Post.findByParam(querys);
  const creators = posts.map(p => p.creator);
  const users = (await User.fetchAvatars(creators)).reduce((p, v) => (p[ v.id ] = v.avatar, p), {});
  const postsToUse = posts.map(p => {
    if (users[ p.creator ]) {
      return Object.assign(p.toObject(), { creatorAvatar: users[ p.creator ] });
    }
    return p;
  });


  // 获取当前类目下问题数
  res.json({
    success: true,
    code: 200,
    data: {
      list: postsToUse,
      count: 198
    },
    message: ''
  });
});


/**
 * 添加新任务
 */
router.post('/add', async (req, res, next) => {
  let tags = req.body.tags && JSON.parse(req.body.tags);
  let hasTags = [];
  let newTags = [];
  let tagsResult;

  tags.forEach(function (v) {
    v._id ? hasTags.push(v) : newTags.push(v);
  });

  // tags存储，新建tags，tags涉及到以后排序管理，增删改查，以及关注度等操作需要单独的表管理。
  if (newTags.length) {
    tagsResult = await Tag.create(newTags);
    hasTags = hasTags.concat(tagsResult).map(function (v) {
      return {
        id: v.id || v._id,
        name: v.name
      };
    });
  }

  // todo: 奖励存储，任务与奖励绑定，便于后期任务统筹，统计
  const post = Object.assign({}, req.body, { creator: req.session.user_id, tags: hasTags });

  post.created = new Date();

  try {
    const r = await Post.create(post);
    //res.redirect('/post/' + r._id);// 跳转到详情页
    res.json({
      success: true,
      code: 200,
      data: {
        qid: r._id,
        url: `/post/${r._id}`
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * 添加新任务
 */
router.put('/update', async (req, res, next) => {
  let tags = req.body.tags && JSON.parse(req.body.tags);
  let hasTags = [];
  let newTags = [];
  let tagsResult;

  tags.forEach(function (v) {
    v._id ? hasTags.push(v) : newTags.push(v);
  });

  // tags存储，新建tags，tags涉及到以后排序管理，增删改查，以及关注度等操作需要单独的表管理。
  if (newTags.length) {
    tagsResult = await Tag.create(newTags);
    hasTags = hasTags.concat(tagsResult).map(function (v) {
      return {
        id: v.id || v._id,
        name: v.name
      };
    });
  }

  // todo: 奖励存储，任务与奖励绑定，便于后期任务统筹，统计
  const post = Object.assign({}, req.body, { tags: hasTags });

  post.last_modified = new Date();

  // todo: 任务存在验证，修改权限验证
  try {
    const r = await Post.update({ _id: post.post_id }, post);
    //res.redirect('/post/' + r._id);// 跳转到详情页
    res.json({
      success: true,
      code: 200,
      data: {
        qid: req.body.post_id,
        url: `/post/${req.body.post_id}`
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * 任务详情
 */
router.get('/:post_id', F(async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.session;

  // 查询任务
  let post = await Post.findById(post_id);

  // 查询我的回答 || 查询所有回答
  let ownComments = user_id ? await Comment.findOne({ post_id, creator: user_id }) : null;
  let comments = await Comment.find({ post_id, creator: { $ne: user_id } });
  const comment_user_ids = comments.map(c => c.creator);
  const comment_users = (comment_user_ids.length ? await User.find({ _id: { $in: comment_user_ids } }, [ '_id', 'name', 'signature', 'avatar' ]) : [])
    .reduce((p, u) => (p[ u.id ] = u, p), Object.create(null));
  comments = comments.map(c => {
    const cc = c.toObject();
    cc.creator = comment_users[ c.creator ] || c.creator;
    return cc;
  });

  // 查询问题发布者信息 || 查询当前用户信息
  const user = await User.findById(user_id, [ '_id', 'name', 'signature', 'avatar' ]);
  const creator = await User.findById(post.creator, [ '_id', 'name', 'signature', 'avatar' ]);

  const total_subscribed = post.subscribers.length;
  const user_ids = post.subscribers.slice(0, 50);// 最多显示5个

  post.subscribers = null;
  if (ownComments) {
    ownComments = Object.assign(ownComments.toObject(), { creator: user.toObject() });
  }
  if (post) {
    post = Object.assign(post.toObject(), { creator: creator.toObject() });
  }

  const users = user_ids.length ? await User.find({ _id: { $in: user_ids } }, [ '_id', 'name', 'avatar' ]) : [];
  res.render('post.html', { post, totalSubscribed: total_subscribed, subscribers: users, ownComments, comments });
}));

/**
 * 获取评论列表
 */
router.get('/:post_id/comments', F(async (req, res) => {
  const { post_id } = req.params;
  const comments = await Comment.find({ post_id });

  res.json({
    success: true,
    code: 200,
    data: {
      comments
    }
  });
}));

/**
 * 添加评论
 */
router.post('/comment/:post_id', login_required, async (req, res, next) => {
  const { post_id } = req.params;
  const { commentId } = req.body;
  const post = await Post.findById(post_id);
  let comment;

  if (!post || !post._doc) {
    return next('No post found.');
  }

  if (commentId) {
    comment = await Comment.findById(commentId);
    delete req.body.commentId;
    Object.assign(comment, req.body);
  } else {
    comment = new Comment();
    Object.assign(comment, req.body, { post_id, created: new Date(), creator: req.session.user_id });
  }

  try {
    const r = await comment.save();
    await Post.findByIdAndUpdate(post_id, { $inc: { updates: 1 } });
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
  upvote: 'upvotes',
  downvote: 'downvotes',
  pageview: 'views',
  subscribe: { field: 'subscribers', op: '$push' }
};
const ops = Object.keys(op_field_mapping);
/**
 * op:
 * 1. upvote
 * 2. downvote
 * 3. pageview
 *
 */
router.post('/op/:post_id', F(async (req, res, next) => {
  const { post_id } = req.params;
  const { op } = req.body;
  if (!ops.includes(op)) {
    return next(new Error(`Unsupported op: <${op}>`));
  }
  let update;
  if (op === 'subscribe') {
    update = { $push: { subscribers: req.session.user_id }, $inc: { updates: 1 } };
  } else if (op === 'upvote') {
    update = { $inc: { upvotes: 1, total_votes: 1, updates: 1 } };
  } else if (op === 'downvote') {
    update = { $inc: { downvotes: 1, total_votes: -1, updates: -1 } };
  } else {
    update = { $inc: { pageview: 1 } };
  }
  // 返回修改后的post
  const post = await Post.findByIdAndUpdate(post_id, update, { 'new': true });
  res.json({
    success: true,
    code: 200,
    data: post,
    message: ''
  });
}));

/**
 * 获取关注用户列表
 *
 * url: /post/follows/:post_id
 * res: {ok:true} 关注成功
 */
router.get('/follows/:post_id', F(async (req, res, next) => {
  const { post_id } = req.params;
  const r = await Post.find({ _id: post_id });

  // todo: 返回关注此问题的前50名用户
  res.json({
    success: true,
    code: 200,
    data: [ {
      uid: 1,
      nickname: '',
      avatar: '',
      url: ''
    } ]
  });
}));

/**
 * 关注问题
 *
 * url: /post/:post_id/subscribe
 * res: {ok:true} 关注成功
 */
router.get('/subscribe/:post_id', F(async (req, res, next) => {
  const { post_id } = req.params;
  const { user_id } = req.session;

  // todo: 关注问题成功，返回用户信息
  if (req.session && user_id) {
    const user = await User.findById(user_id, [ '_id', 'name', 'avatar' ]);
    const post = await Post.findById(post_id);

    if (post.subscribers.includes(user_id)) {
      res.json({
        success: false,
        code: 200,
        message: '您已关注',
        data: null
      });
    } else {
      post.subscribers.push(user_id);
      post.save();

      res.json({
        success: true,
        code: 200,
        message: '',
        data: user.toObject()
      });
    }
  } else {
    res.json({
      success: false,
      code: 200,
      message: '请先登录',
      data: null
    });
  }
}));

/**
 * 精选回答
 */
router.get('/comments/selected', F(async (req, res) => {
  const comments = await Comment.find({}).sort({ upvotes: -1 }).limit(10);
  const post_ids = comments.map(c => c.post_id);
  const posts = await Post.find({ id: { $in: post_ids } });
  const mapping = R.indexBy(R.prop('id'), posts);
  const data = comments.map(c => Object.assign(c.toObject(), { post: mapping[ c.post_id ] }));
  res.json({
    success: true,
    data
  });
}));

/**
 * 相关推荐
 */
router.get('/:post_id/related', F(async (req, res) => {
  const related = await Post.related(req.query.size || 5);
  const postIds = related.map(p => p._id.toString());

  const count = await Comment.aggregate([
    { $match: { post_id: { $in: postIds } } },
    { $group: { _id: '$post_id', count: { $sum: 1 } } }
  ]);
  const countMap = R.indexBy(R.prop('id'), count);
  const rel = related.map(p => Object.assign(p, { answerNum: (countMap[ p.id ] || { count: 0 }).count }));
  res.json({
    success: true,
    data: rel
  });
}));


module.exports = router;
