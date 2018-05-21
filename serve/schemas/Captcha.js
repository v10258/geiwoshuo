const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 验证码
 */
const schema = new Schema({
  token: String, // 验证码
  created: Date
});

const Model = mongoose.model('captcha', schema);

module.exports = Model;
