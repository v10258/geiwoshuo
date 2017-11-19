const nanoid = require('nanoid');
const router = require('express').Router();
const login_required = require('./middlewares/login_requred');
const { Tag } = require('../mongo');
const F = require('./Factory');
const crypt = require('../util/crypt');


/**
 * 根据关键词查询标签
 */
router.get('/auto_complete', F(async (req, res) => {
  let key = req.query.q;
  const tags = await Tag.autoCompleteQuery(key) || [];

  res.json({
    success: true,
    code: 200,
    message: '',
    data: tags
  })
}));

module.exports = router;
