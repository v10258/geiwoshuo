const router = require('express').Router();
const multer = require('multer');
const {format} = require('date-fns');
const nanoid = require('nanoid');

const file_upload_to = __dirname + '/../../public/ugc/';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, file_upload_to)
  },
  filename: function (req, file, cb) {
    cb(null, format(Date.now(), 'YYYY-MM-DD') + '_' + nanoid() + '_' + file.originalname);
  }
});

const upload = multer({storage});


router.post('/upload', upload.array('files'), (req, res, next) => {
  res.json({
    success: true,
    code: 200,
    data: {
      files: req.files.map(f => ({
        url: '/ugc/' + f.filename,
        name: f.filename,
        type: f.mimetype,
        size: f.size,
      }))
    }
  });
});

module.exports = router;
