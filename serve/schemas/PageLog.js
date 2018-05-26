const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 请求日志
 */
const schema = new Schema({
  method: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String },
  ua: { type: String },
  ip: { type: String },
  user_id: { type: String },
  created: { type: Date, required: true },
  duration: { type: Number, required: true }
});

/**
 * 日uv
 */
schema.statics.dailyUserViews = async function (date) {
  const start = new Date(date);
  const end = new Date(date);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  const result = await this.aggregate([
    { $match: { created: { $gte: start, $lte: end }, user_id: { $ne: '-1' } } },
    { $group: { _id: '$user_id' } },
    { $group: { _id: 1, total: { $sum: 1 } } }
  ]);
  return result ? result[ 0 ].total : 0;
}
;

const Model = mongoose.model('page_logs', schema);

module.exports = Model;
