const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * 用户表
 */
const schema = new Schema({
  name: {type: String},// 用户名
  phone: {type: String, required: true, unique: true},// 联系电话
  email: {type: String},// 邮箱
  password: {type: String},// 密码
  signature: {type: String},// 个性签名
  created: {type: Date},// 创建时间
  avatar: {type: String},// 用户头像
  subscribed: {type: [String], default: 0},// 关注的任务
  upvotes: {type: Number, default: 0},// 获赞数
  fans: {type: [String], default: []},// 粉丝
});

/**
 * 查询活跃用户
 */
schema.statics.activeUsers = function () {
  return this.find({});
};

schema.statics.fetchAvatars = function (userIds) {
  return this.find({_id: {$in: userIds}}, '_id avatar');
};

const Model = mongoose.model('users', schema);


module.exports = Model;
