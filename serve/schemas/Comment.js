const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 评论
 */
const schema = new Schema({
  post_id: { type: String, required: true }, // 源任务id
  response_to: { type: String, default: '' }, // 回复哪一个comment
  body: { type: String, required: true }, // 正文
  creator: { type: String, required: true }, // 创建人id
  created: { type: Date }, // 创建时间
  upvotes: { type: Number, 'default': 0 }, // 赞同
  downvotes: { type: Number, 'default': 0 }, // 反对
  status: { type: String, 'default': 'actived' }, // actived 活跃 attend  参与响应， completed 已完成
  type: { type: String, enum: [ 'commenting', 'participating' ], default: 'commenting' },
  anonymous: { Type: Boolean }
});

const Model = mongoose.model('comments', schema);

module.exports = Model;
