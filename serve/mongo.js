const os = require('os');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Post = require('./schemas/Post');
const User = require('./schemas/User');
const Comment = require('./schemas/Comment');

const {mongo} = require('./config');

const cfg = process.env.ATLAS || (os.platform() === 'darwin' ? mongo.dev : mongo.prod);


mongoose.connect(cfg, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});


module.exports = {
  Post,
  User,
  Comment,
  stats() {
    // 统计各记录的条数
    return [Post].map(async m => ({name: m.modelName, count: await m.count()}));
  },
  mongoose
};
