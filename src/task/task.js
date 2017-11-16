
require('./task.scss');
require('../layout/header.js');
require('../layout/footer.js');

require('./js/follow.js');

var $ = require('jquery')

require('../common/js/jquery-file-upload/jquery.fileupload.js')

var tinymce = require('../common/js/tinymce/tinymce.min.js')

import { REMOTE } from '../common/js/ajax.js'


tinymce.init({
  selector: 'textarea#editor',
  menubar: false,
  plugins: ['autoresize lists link hr fullscreen'],
  toolbar: ['bold italic title blockquote |  bullist numlist link hr | imagegws', 'fullscreen'],

  // 编辑区域应用样式
  content_css: '/css/ask.css',
  content_style: 'p {margin:0; line-height: 1.5;}',

  // 去掉商标和路径
  branding: false,
  elementpath: false,

  // 图片上传
  //image_description: false,
  //image_dimensions: false,
  images_upload_url: REMOTE.ask.ImagUupload,
  automatic_uploads: true,

  // 编辑器初始化回调
  init_instance_callback: function (editor) {
    console.log('Editor: ' + editor.id + ' is now initialized.')
  },

  //输入框区域自动变大
  autoresize_min_height: 60,
  autoresize_max_height: 360,
  autoresize_bottom_margin: 30,

  // 
  setup: function (editor) {
    editor.addButton('editor-control', {
      text: 'B',
      icon: false,
      onclick: function (e) {
        var $elem = $(e.target);
        $elem = $elem.hasClass('mce-txt') ? $elem.parent() : $elem;
        if ($elem.hasClass('active')) {
          $elem.removeClass('active');
          $('.mce-toolbar.mce-last').hide();
        } else {
          $elem.addClass('active');
          $('.mce-toolbar.mce-last').show();
        }
      }
    })
    editor.addButton('imagegws', {
      icon: 'image',
      onclick: function () {
        $('#fileupload').fileupload({
          url: REMOTE.ask.fileupload,
          dataType: 'json',
          done: function (ev, data) {
            editor.insertContent(`<img src="${data.result.data.files[0].url}">`);
          },
          progressall: function (e, data) {
              var progress = parseInt(data.loaded / data.total * 100, 10);
              console.log('progress', progress);
          }
        }).trigger('click');
      }
    })
    
    editor.addButton('qr-code', {
      text: 'QR',
      icon: false,
      onclick: function () {
        editor.insertContent("&nbsp;<b>将url转成二维码，并插入编辑器</b>&nbsp;")
      }
    })

    editor.addButton('title', {
      text: 'H',
      icon: false,
      onclick: function() {
        editor.execCommand('mceToggleFormat', false, 'h2');
      },
    
      onpostrender: function() {
        var btn = this;
        editor.on('init', function() {
          editor.formatter.formatChanged('h2', function(state) {
            btn.active(state);
          });
        });
      }
    });    
  }
})