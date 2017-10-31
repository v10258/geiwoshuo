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
    Object.assign(post, req.body, {creator: '59f6a0398918143155bcd690', tags: req.body.tags.trim().split(/\s+/)});

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
    const creator = await User.findById(post.creator, ['name', '_id']);
    res.render('post.html', {post, creator});
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
            ok: true,
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



module.exports = router;