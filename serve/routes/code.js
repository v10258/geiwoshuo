const router = require('express').Router();
const nanoid = require('nanoid/generate').bind(null, '1234567890');
const F = require('./Factory');
const {VerificationCode} = require('../mongo');
const debug = require('debug')('gws:code');


/**
 * 1. 注册时获取验证码: curl 127.0.0.1:3001/code/gen -d 'type=SIGNUP&phone=123456789'
 */
router.post('/gen', F(async (req, res, next) => {

  const {type,} = req.body;

  if (!type) {
    return next(new Error('type is required.'));
  }

  if (type === 'SIGNUP') {// 注册时的验证码
    const {phone} = req.body;
    if (!phone) {
      return next('phone is required.');
    }
    const re = await VerificationCode.findOne({phone, type});
    if (re) {// 已经有该记录
      res.json({
        success: true,
        data: {
          code: re.code
        }
      });
      debug('code: %s', re.code);
      return;
    }
    const codeNew = new VerificationCode;
    Object.assign(codeNew, {type, phone, code: nanoid(4)});
    await codeNew.save();
    res.json({
      success: true,
      data: {
        code: codeNew.code
      }
    });
    debug('code: %s', re.code);
  }


}));

module.exports = router;
