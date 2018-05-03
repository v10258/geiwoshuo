const router = require('express').Router();
const {User} = require('../mongo');

/**
 * 我的信息
 */
router.get('/', async (req, res) => {
  const {user_id} = req.session;
  const user = await User.findById(user_id);

  res.render('setting.html', {user});
});


module.exports = router;
