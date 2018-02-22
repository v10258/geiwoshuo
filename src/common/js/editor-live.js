var $ = require('jquery')

import { REMOTE } from './ajax.js';

require('./jquery-file-upload/jquery.fileupload.js')

var tinymce = require('./tinymce/tinymce.min.js')

var editorTodo = {
  imagegwsHandler: function (editor) {
    $('#fileupload').fileupload({
      url: REMOTE.ask.fileupload,
      done: function (ev, data) {
        console.log('result', data.result);
        let result = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        editor.insertContent(`<img src="${result.data.files[0].url}">`);
      },
      progressall: function (ev, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          console.log('progress', progress);
      }
    }).trigger('click');
  },
  qrCodeHandler: function (editor) {
    editor.insertContent("&nbsp;<b>将url转成二维码，并插入编辑器</b>&nbsp;")
  },
  initHandler: function (editor) {
    console.log('Editor: ' + editor.id + ' is now initialized.')
  }
}

tinymce.init({
  selector: 'textarea#editor',
  menubar: false,
  plugins: ['autoresize link'],
  toolbar: ['link imagegws qr-code'],

  // 编辑区域应用样式
  content_style: 'p {margin:0; line-height: 1.5;} img {max-width: 600px;max-height: 800px;}',

  // 去掉底部状态
  statusbar: false,

  // 图片上传
  // images_upload_url: REMOTE.ask.ImagUupload,
  // automatic_uploads: true,

  // 编辑器初始化回调
  init_instance_callback: editor.initHandler,

  //输入框区域自动变大
  autoresize_min_height: 90,
  autoresize_max_height: 360,
  autoresize_bottom_margin: 5,

  //
  setup: function (editor) {

    editor.addButton('imagegws', {
      icon: 'image',
      onclick: function(){
        editorTodo.imagegwsHandler(editor)
      }
    })

    editor.addButton('qr-code', {
      text: 'QR',
      icon: '',
      onclick: function() {
        editorTodo.qrCodeHandler(editor)
      }
    })
  }
})

export default tinymce;
