const mongoose = require('mongoose');
const {Schema} = mongoose;


/**
 * 验证码
 */
const schema = new Schema({
  code: String,// 验证码
  phone: {type: String},
  type: {type: String, enum: ['NONE', 'SIGNUP'], default: 'NONE'},
  created: Date
});


const Model = mongoose.model('verification_code', schema);

module.exports = Model;
