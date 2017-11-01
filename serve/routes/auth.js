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

module.exports = router;
