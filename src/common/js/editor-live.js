var $ = require('jquery')

require('./jquery-file-upload/jquery.fileupload.js')

var tinymce = require('./tinymce/tinymce.min.js')

const editor = {
  imagegwsHandler: function () {
    $('#fileupload').fileupload({
      url: REMOTE.ask.fileupload,
      done: function (ev, data) {
        console.log('result', data.result);
        editor.insertContent(`<img src="${data.result.data.files[0].url}">`);
      },
      progressall: function (e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          console.log('progress', progress);
      }
    }).trigger('click');
  },
  qrCodeHandler: function () {
    editor.insertContent("&nbsp;<b>将url转成二维码，并插入编辑器</b>&nbsp;")
  },
  initHandler: function (editor) {
    console.log('Editor: ' + editor.id + ' is now initialized.')
  }
}

const tinymceLive = tinymce.init({
  selector: 'textarea#editor',
  menubar: false,
  plugins: ['autoresize link'],
  toolbar: ['link imagegws qr-code'],

  // 编辑区域应用样式
  content_style: 'p {margin:0; line-height: 1.5;}',

  // 去掉商标和路径
  branding: false,
  elementpath: false,

  // 图片上传
  // images_upload_url: REMOTE.ask.ImagUupload,
  // automatic_uploads: true,

  // 编辑器初始化回调
  init_instance_callback: editor.initHandler,

  //输入框区域自动变大
  autoresize_min_height: 60,
  autoresize_max_height: 360,
  autoresize_bottom_margin: 30,

  //
  setup: function (editor) {

    editor.addButton('imagegws', {
      icon: 'image',
      onclick: editor.imagegwsHandler
    })

    editor.addButton('qr-code', {
      text: 'QR',
      icon: '',
      onclick: editor.qrCodeHandler
    })
  }
})

export default tinymceLive;
