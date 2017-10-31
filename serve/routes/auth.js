const router = require('express').Router();
const {User} = require('../mongo');
const F = require('./Factory');
const session = require('./middlewares/session');
const login_required = require('./middlewares/login_requred');

router.use(session);

router.get('/', (req, res) => {
    res.json('hello world: ' + req.session.user_id);
});

router.get('/me', F(async (req, res, next) => {
    const user = await User.findById(req.session.user_id);
    res.json(user);
}));

router.get('/session_user', login_required, F(async (req, res, next) => {
    res.json(req.user);
}));

router.post('/login', F(async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email, password});
    if (!user) {
        return next(new Error('User not found.'));
    }
    req.session.user_id = user._id;
    req.session.save();
    res.json({ok: true});
}));


module.exports = router;