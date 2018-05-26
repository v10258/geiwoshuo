const os = require('os');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Post = require('./schemas/Post');
const User = require('./schemas/User');
const Tag = require('./schemas/Tag');
const Comment = require('./schemas/Comment');
const VerificationCode = require('./schemas/VerificationCode');
const Captcha = require('./schemas/Captcha');
const PageLog = require('./schemas/PageLog');

const { mongo } = require('./config');

const cfg = process.env.ATLAS || (os.platform() === 'darwin' ? mongo.dev : mongo.prod);
mongoose.set('debug', true);
mongoose.connect(cfg, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

module.exports = {
  Post,
  User,
  Tag,
  Comment,
  VerificationCode,
  Captcha,
  PageLog,
  stats() {
    // 统计各记录的条数
    return [ Post ].map(async m => ({ name: m.modelName, count: await m.count() }));
  },
  mongoose
};
