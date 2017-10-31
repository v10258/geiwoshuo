const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * 评论
 */
const schema = new Schema({
    post_id: {type: String, required: true},// 源任务id
    response_to: {type: String},// 回复哪一个comment
    body: {type: String, required: true},// 正文
    creator: {type: String, required: true},// 创建人id
    created: {type: Date},// 创建时间
    upvotes: {type: Number, default: 0},// 赞同
    downvotes: {type: Number, default: 0},// 反对
});


const Model = mongoose.model('comments', schema);

module.exports = Model;
