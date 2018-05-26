const R = require('ramda')
const router = require('express').Router()
const { Post, Comment, User, Tag } = require('../mongo')
const F = require('./Factory')
const loginRequired = require('./middlewares/login_requred')
const codes = require('./codes')

router.get('/error', F(async (req, res, next) => {
  next(new Error('啊啊报错了！'))
}))

/**
 * 任务列表
 */
router.get('/query', async (req, res) => {
  const { count, posts } = await Post.findByParam(req.query)
  const creators = posts.map(p => p.creator)
  const users = (await User.fetchAvatars(creators)).reduce((p, v) => (p[ v.id ] = v.avatar, p), {})
  const postsToUse = posts.map(p => {
    if (users[ p.creator ]) {
      return Object.assign(p.toObject(), { creatorAvatar: users[ p.creator ] })
    }
    return p
  })

  // 获取当前类目下问题数
  res.json({
    success: true,
    code: 200,
    data: {
      list: postsToUse,
      count
    }
  })
})

/**
 * 添加新任务
 */
router.post('/add', async (req, res, next) => {
  let tags = req.body.tags && JSON.parse(req.body.tags)
  let hasTags = []
  let newTags = []
  let tagsResult

  tags.forEach(function (v) {
    v._id ? hasTags.push(v) : newTags.push(v)
  })

  // tags存储，新建tags，tags涉及到以后排序管理，增删改查，以及关注度等操作需要单独的表管理。
  if (newTags.length) {
    tagsResult = await Tag.create(newTags)
    hasTags = hasTags.concat(tagsResult).map(function (v) {
      return {
        id: v.id || v._id,
        name: v.name
      }
    })
  }

  // todo: 奖励存储，任务与奖励绑定，便于后期任务统筹，统计
  const post = Object.assign({}, req.body, { creator: req.session.user_id, tags: hasTags })

  post.created = new Date()

  try {
    const r = await Post.create(post)
    res.json({
      success: true,
      code: 200,
      data: {
        qid: r._id,
        url: `/post/${r._id}`
      }
    })
  } catch (e) {
    next(e)
  }
})

/**
 * 添加新任务
 */
router.put('/update', async (req, res, next) => {
  let tags = req.body.tags && JSON.parse(req.body.tags)
  let hasTags = []
  let newTags = []
  let tagsResult

  tags.forEach(function (v) {
    v._id ? hasTags.push(v) : newTags.push(v)
  })

  // tags存储，新建tags，tags涉及到以后排序管理，增删改查，以及关注度等操作需要单独的表管理。
  if (newTags.length) {
    tagsResult = await Tag.create(newTags)
    hasTags = hasTags.concat(tagsResult).map(function (v) {
      return {
        id: v.id || v._id,
        name: v.name
      }
    })
  }

  // todo: 奖励存储，任务与奖励绑定，便于后期任务统筹，统计
  const post = Object.assign({}, req.body, { tags: hasTags })

  post.last_modified = new Date()

  // todo: 任务存在验证，修改权限验证
  try {
    const r = await Post.update({ _id: post.post_id }, post)
    if (!r) return
    res.json({
      success: true,
      code: 200,
      data: {
        qid: req.body.post_id,
        url: `/post/${req.body.post_id}`
      }
    })
  } catch (e) {
    next(e)
  }
})

/**
 * 任务详情
 */
router.get('/:post_id', F(async (req, res) => {
  const { post_id } = req.params
  const { user_id } = req.session

  // 查询任务
  let post = await Post.findById(post_id)

  // 查询我的回答 || 查询所有回答
  let ownComments = user_id ? await Comment.findOne({ post_id, creator: user_id }) : null
  let comments = await Comment.find({ post_id, creator: { $ne: user_id } })
  const commentUserIds = comments.map(c => c.creator)
  const commentUsers = (commentUserIds.length ? await User.find({ _id: { $in: commentUserIds } }, [ '_id', 'name', 'signature', 'avatar' ]) : [])
    .reduce((p, u) => (p[ u.id ] = u, p), Object.create(null))
  comments = comments.map(c => {
    const cc = c.toObject()
    cc.creator = commentUsers[ c.creator ] || c.creator
    return cc
  })

  // 查询问题发布者信息 || 查询当前用户信息
  const user = await User.findById(user_id, [ '_id', 'name', 'signature', 'avatar' ])
  const creator = await User.findById(post.creator, [ '_id', 'name', 'signature', 'avatar' ])

  const totalSubscribed = post.subscribers.length
  const userIds = post.subscribers.slice(0, 50)// 最多显示5个

  post.subscribers = null
  if (ownComments) {
    ownComments = Object.assign(ownComments.toObject(), { creator: user.toObject() })
  }
  if (post) {
    post = Object.assign(post.toObject(), { creator: creator.toObject() })
  }

  const users = userIds.length ? await User.find({ _id: { $in: userIds } }, [ '_id', 'name', 'avatar' ]) : []
  res.render('post.html', { post, totalSubscribed: totalSubscribed, subscribers: users, ownComments, comments })
}))

/**
 * 获取评论列表
 */
router.get('/:post_id/comments', F(async (req, res) => {
  const { post_id } = req.params
  const comments = await Comment.find({ post_id })

  res.json({
    success: true,
    code: 200,
    data: {
      comments
    }
  })
}))

/**
 * 添加评论
 */
router.post('/:post_id/comment', loginRequired, F(async (req, res, next) => {
  const { post_id } = req.params
  const { commentId, body, responseTo = '', joinChecked, anonymousChecked = false } = req.body
  const post = await Post.findById(post_id)
  if (!post || !post._doc) {
    return next('No post found.')
  }
  const comment = commentId ? await Comment.findById(commentId) : new Comment()

  Object.assign(comment, {
    post_id,
    body,
    response_to: responseTo,
    created: new Date(),
    creator: req.session.user_id,
    type: joinChecked ? 'participating' : 'commenting',
    anonymous: anonymousChecked
  })
  const r = await comment.save()
  await Post.findByIdAndUpdate(post_id, { $inc: { updates: 1 } })
  res.json({
    success: true,
    code: 200,
    data: r
  })
}))

const actionFieldMap = {
  upvote: 'upvotes',
  downvote: 'downvotes',
  pageview: 'views',
  subscribe: { field: 'subscribers', op: '$push' }
}
const ops = Object.keys(actionFieldMap)
/**
 * op:
 * 1. upvote
 * 2. downvote
 * 3. pageview
 *
 */
router.post('/op/:post_id', F(async (req, res, next) => {
  const { user_id } = req.session
  const { post_id } = req.params
  const { op, undo = false } = req.body // undo 意味着再次点击，有取消的意思
  if (!ops.includes(op)) {
    return next(new Error(`Unsupported op: <${op}>`))
  }

  if (op === 'subscribe') {
    const update = { $addToSet: { subscribers: req.session.user_id }, $inc: { updates: 1 } }
    await Post.update({ _id: post_id }, update)
    return res.json({
      success: true,
      code: 200,
      message: ''
    })
  } else if (op === 'upvote') {
    if (!user_id) {
      res.json({
        success: false,
        code: codes.code_401.code,
        message: 'Login required.'
      })
      return
    }
    if (!undo) { // 点赞
      const result = await Post.update({
        _id: post_id,
        upvoters: { $not: { $all: [ user_id ] } }
      }, {
        $push: { upvoters: user_id },
        $pull: { downvoters: user_id },
        $inc: { upvotes: 1, total_votes: 1, updates: 1 }
      })

      if (result.nModified === 1) {
        const { total_votes } = await Post.buildTotalVotes(post_id)
        return res.json({
          success: true,
          code: 200,
          data: {
            total_votes
          },
          message: ''
        })
      }
      return res.json({
        success: false,
        code: codes.code_406.code,
        message: 'Not Allowed'
      })
    } else { // 取消点赞
      const result = await Post.update({
        _id: post_id,
        upvoters: { $all: [ user_id ] }
      }, { $pull: { upvoters: user_id }, $inc: { upvotes: -1, total_votes: -1, updates: -1 } })

      if (result.nModified === 1) {
        const post = await Post.buildTotalVotes(post_id)
        return res.json({
          success: true,
          code: 200,
          post,
          message: ''
        })
      }
      return res.json({
        success: false,
        code: codes.code_406.code,
        message: 'Not Allowed'
      })
    }
  } else if (op === 'downvote') {

    if (!user_id) {
      res.json({
        success: false,
        code: codes.code_401.code,
        message: 'Login required.'
      })
      return
    }
    if (!undo) {
      const result = await Post.update({
        _id: post_id,
        downvoters: { $not: { $all: [ user_id ] } }
      }, {
        $push: { downvoters: user_id },
        $pull: { upvoters: user_id },
        $inc: { downvotes: 1, total_votes: -1, updates: -1 }
      })

      if (result.nModified === 1) {
        const { total_votes } = await Post.buildTotalVotes(post_id)
        return res.json({
          success: true,
          code: 200,
          data: {
            total_votes
          }
        })
      }
      return res.json({
        success: false,
        code: codes.code_406.code,
        message: 'Not Allowed'
      })
    } else { // 取消
      const result = await Post.update({
        _id: post_id,
        downvoters: { $all: [ user_id ] }
      }, { $pull: { downvoters: user_id }, $inc: { downvotes: -1, total_votes: -1, updates: -1 } })

      if (result.nModified === 1) {
        await Post.buildTotalVotes(post_id)
        return res.json({
          success: true,
          code: 200,
          message: ''
        })
      }
      return res.json({
        success: false,
        code: codes.code_406.code,
        message: 'Not Allowed'
      })
    }

  } else {
    const update = { $inc: { pageviews: 1 } }
    await Post.update({ _id: post_id }, update)
    res.json({
      success: true,
      code: 200,
      message: ''
    })
  }
}))

/**
 * 获取关注用户列表
 *
 * url: /post/follows/:post_id
 * res: {ok:true} 关注成功
 */
router.get('/follows/:post_id', F(async (req, res, next) => {
  const { post_id } = req.params
  const r = await Post.find({ _id: post_id })

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
  })
}))

/**
 * 关注问题
 *
 * url: /post/:post_id/subscribe
 * res: {ok:true} 关注成功
 */
router.get('/subscribe/:post_id', F(async (req, res, next) => {
  const { post_id } = req.params
  const { user_id } = req.session

  // todo: 关注问题成功，返回用户信息
  if (req.session && user_id) {
    const user = await User.findById(user_id, [ '_id', 'name', 'avatar' ])
    const post = await Post.findById(post_id)

    if (post.subscribers.includes(user_id)) {
      res.json({
        success: false,
        code: 200,
        message: '您已关注',
        data: null
      })
    } else {
      post.subscribers.push(user_id)
      post.save()

      res.json({
        success: true,
        code: 200,
        message: '',
        data: user.toObject()
      })
    }
  } else {
    res.json({
      success: false,
      code: 200,
      message: '请先登录',
      data: null
    })
  }
}))

/**
 * 精选回答
 */
router.get('/comments/selected', F(async (req, res) => {
  const { size = 5 } = req.query
  const comments = await Comment.find({}).sort({ upvotes: -1 }).limit(size)
  const postIds = comments.map(c => c.post_id)
  const posts = await Post.find({ _id: { $in: postIds } })
  const mapping = R.indexBy(R.prop('id'), posts)
  const data = comments.map(c => {
    return {
      _id: c.post_id,
      title: (mapping[ c.post_id ] || {}).title,
      answerId: c.id,
      content_abstract: {
        text: c.body.replace(/(<([^>]+)>)/ig, '').slice(0, 40),
        thumbnail: (/<img\ssrc="(.+?)"\s\/>/.exec(c.body) || [])[ 1 ] || ''
      }
    }
  })
  res.json({
    success: true,
    data
  })
}))

/**
 * 相关推荐
 */
router.get('/:post_id/related', F(async (req, res) => {
  const related = await Post.related(req.query.size || 5)
  const postIds = related.map(p => p._id.toString())

  const count = await Comment.aggregate([
    { $match: { post_id: { $in: postIds } } },
    { $group: { _id: '$post_id', count: { $sum: 1 } } }
  ])
  const countMap = R.indexBy(R.prop('id'), count)
  const rel = related.map(p => Object.assign(p, { answerNum: (countMap[ p.id ] || { count: 0 }).count }))
  res.json({
    success: true,
    data: rel
  })
}))

module.exports = router
