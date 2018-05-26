const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * 任务
 */
const schema = new Schema({

  title: { type: String, required: true }, // 主标题
  body: { type: String }, // 正文
  tags: {
    type: [ {
      id: String,
      name: String
    } ]
  }, // 标签
  expired: { type: Date }, // 过期时间
  creator: { type: String, required: true }, // 创建人id
  created: { type: Date }, // 创建时间
  last_modified: { type: Date }, // 最近一次修改时间
  subscribers: { type: [ String ] }, // 关注人id
  upvoters: { type: [ String ], default: [] }, // 点赞的人
  upvotes: { type: Number, 'default': 0 }, // 赞同
  downvoters: { type: [ String ], default: [] }, // 反对的人
  downvotes: { type: Number, 'default': 0 }, // 反对
  total_votes: { type: Number, 'default': 0 }, // 赞同-反对
  pageviews: { type: Number, 'default': 0 }, // 浏览数
  updates: { type: Number, 'default': 0 }, // 动态 = 回复数 + 关注数 + 点赞(点赞=upvotes-downvotes?)
  coins: { type: Number, 'default': 0 }, //金币
  bounty: { type: Number, 'default': 0 }, //赏金
  custom: { type: String, 'default': '' }, // 其它自定义报酬
  city: { type: String, 'default': '' }, // 任务发布区域
  anonymous: { type: Boolean, 'default': false }, // 是否匿名


  // 更多
  valid_time: { type: Number, 'default': -1 }, // 任务有效时间
  quantity: { type: Number, 'default': 1 }, // 多人任务

  // 响应条件
  authentication: { type: String }, // 实名认证
  member_level: { type: Number }, // 会员等级
  ant_credit: { type: String }, // 蚂蚁信用

  //定向发布
  member_tags: { type: [ String ] }, // 面向关注了指定便签的用户
  groups: { type: [ String ] }, // 面向指定圈子
  members: { type: [ String ] }// 面向指定用户

}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

/**
 * 根据类型查询
 */
schema.statics.findByType = function (type = 'HOT') {
  if (type === 'HOT') { //热门
    return this.find({}).sort({ upvotes: -1 }).limit(20);
  } else if (type === 'LATEST') { //最新
    return this.find({}).sort({ created: -1 }).limit(20);
  } else if (type === 'BOUNTY') { //赏金

  } else if (type === 'PROMO') { //推广

  } else {
    throw Error('Unsupported type: ' + type);
  }
};

schema.statics.findByParam = async function (query) {
  const { pageNum, pageSize, sort: type } = query;
  const start = (pageNum - 1) * pageSize;

  let sort;
  if (type === 'hot') { // 热门
    sort = { total_votes: -1 };
  } else if (type === 'latest') { // 最新
    sort = { created: -1 };
  } else if (type === 'bounty') { // 赏金
    sort = { upvotes: 1 };
  } else if (type === 'promo') { // 推广
    sort = { upvotes: 1 };
  } else {
    throw Error('Unsupported type: ' + type);
  }
  const [ count, posts ] = await Promise.all([ this.count(), this.find().sort(sort).skip(+start).limit(+pageSize) ]);
  return { count, posts };
};

schema.statics.findByUser = function (userId) {
  return this.find({ creator: userId }).sort({ created: 1 });
};

/**
 * 热门标签
 */
schema.statics.hotTags = function (limit = 10) {
  return this.aggregate([ { $unwind: '$tags' }, {
    $group: {
      _id: '$tags',
      total: { $sum: 1 }
    }
  }, { $sort: { total: -1 } }, { $limit: limit } ]);
};

schema.statics.related = function (size = 5) {
  return this.aggregate([ { $sample: { size } } ]);
};

schema.statics.buildTotalVotes = async function (postId) {
  postId = mongoose.Types.ObjectId(postId); // 在agg中需要强制转换
  const [ res ] = await this.aggregate([
    { $match: { _id: postId } },
    { $project: { total_upvotes: { $size: '$upvoters' }, total_downvotes: { $size: '$downvoters' } } }
  ]) || [];
  if (!res) {
    return;
  }

  return await this.findByIdAndUpdate(postId, {
    $set: {
      upvotes: res.total_upvotes,
      downvotes: res.total_downvotes,
      total_votes: res.total_upvotes - res.total_downvotes
    }
  }, { new: true });
};

/**
 * 用于问题响应率统计
 */
schema.statics.dailyStat = function (date) {
  const start = new Date(date);
  const end = new Date(date);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  this.aggregate([
    { $match: { created: { $gte: start, $lte: end } } }

  ]);
};

schema.virtual('content_abstract').get(function () {
  const { body } = this;
  const [ , image_url ] = /<img\ssrc="(.+?)"\s\/>/.exec(body) || [];
  return {
    image_url,
    text: body.replace(/(<([^>]+)>)/ig, '').slice(0, 100)
  };
});

const Model = mongoose.model('posts', schema);

module.exports = Model;
