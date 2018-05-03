const router = require('express').Router();
const multer = require('multer');
const {format} = require('date-fns');
const nanoid = require('nanoid');
const path = require('path');
const fs = require('fs');
const F = require('./Factory');
const {User} = require('../mongo');

const pic_server_domain = '';
const file_upload_post = path.resolve(__dirname, '../../public/ugc/');
const file_upload_avatar = path.resolve(__dirname, '../../public/ugc/avatar/');

if (!fs.existsSync(file_upload_post)) {
  fs.mkdirSync(file_upload_post);
}

if (!fs.existsSync(file_upload_avatar)) {
  fs.mkdirSync(file_upload_avatar);
}

const storagePost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, file_upload_post)
  },
  filename: function (req, file, cb) {
    cb(null, format(Date.now(), 'YYYY-MM-DD') + '_' + nanoid() + '_' + file.originalname);
  }
});

const storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, file_upload_avatar)
  },
  filename: function (req, file, cb) {
    const {user_id} = req.session;
    cb(null, format(Date.now(), 'YYYY-MM-DD') + '_' + user_id + '_' + file.originalname);
  }
});

const uploadPost = multer({storage:storagePost});
const uploadAvatar = multer({storage:storageAvatar});


router.post('/upload', uploadPost.array('files'), (req, res, next) => {
  res.json({
    success: true,
    code: 200,
    data: {
      files: req.files.map(f => ({
        url: `${pic_server_domain}/ugc/${f.filename}`,
        name: f.filename,
        type: f.mimetype,
        size: f.size,
      }))
    }
  });
});

router.post('/avatar', uploadAvatar.single('avatar'), F(async (req, res, next) => {
  const {user_id} = req.session;
  const avatarImgUrl = `${pic_server_domain}/ugc/avatar/${req.file.filename}`;

  await User.update({ _id: user_id}, { $set: { avatar: avatarImgUrl }});

  res.json({
    success: true,
    message: '',
    data: {
      avatar: avatarImgUrl
    },
    code: 200
  });
}));

module.exports = router;
