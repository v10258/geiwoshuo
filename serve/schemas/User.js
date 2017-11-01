const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * 用户表
 */
const schema = new Schema({
    name: {type: String},// 用户名
    phone: {type: String, required: true, unique: true},// 联系电话
    email: {type: String, unique: true},// 邮箱
    password: {type: String},// 密码
    signature: {type: String},// 个性签名
    created: {type: Date},// 创建时间
    avatar: {type: String},// 用户头像
    subscribed: {type: [String]},// 关注的任务
});

/**
 * 查询活跃用户
 */
schema.statics.activeUsers = function () {
    return this.find({});
};

const Model = mongoose.model('users', schema);


module.exports = Model;
