const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * 标签表
 */
const schema = new Schema({
  tid: {type: Schema.Types.ObjectId}, // 标签id
  name: {type: String},// 标签名
  cname: {type: String}, // 标签中文拼音
  shortName: {type: String} // 标签拼音首字母
});

/**
 * 查询标签
 */
schema.statics.autoCompleteQuery = function (key) {
  return this.find({
    $or: [
        {name: new RegExp(key, 'i')},
        {cname:new RegExp(key, 'i')},
        {shortName:new RegExp(key, 'i')}
     ]
  });
};

const Model = mongoose.model('tags', schema);

module.exports = Model;
