require('./ask.scss')

require('../layout/header.js')

var tinymce = require('../common/js/tinymce/tinymce.min.js')

var $ = require('jquery')

import Vue from 'vue/dist/vue.js'

tinymce.init({
  selector: 'textarea#editor',
  menubar: false,
  plugins: ['image autoresize lists link image hr'],
  toolbar: ['editor-control image mceImage qr-code',
  'undo redo | titleformat bold italic |  bullist numlist | link hr | removeformat'],
  block_formats: '标题=h2;代码块=pre',

  // 编辑区域应用样式
  content_css: '/css/ask.css',
  content_style: 'p {margin:0; line-height: 1.5;}',

  // 去掉商标和路径
  branding: false,
  elementpath: false,

  // 图片上唇
  image_description: false,
  image_dimensions: false,
  images_upload_url: 'post/postAcceptor',
  images_upload_handler: function (blobInfo, success, failure) {
    setTimeout(function () {
      // no matter what you upload, we will turn it into TinyMCE logo :)
      success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png')
    }, 2000)
  },

  // 编辑器初始化回调
  init_instance_callback: function (editor) {
    console.log('Editor: ' + editor.id + ' is now initialized.')
  },

  file_browser_callback: function(field_name, url, type, win) {
    //win.document.getElementById(field_name).value = 'my browser value';
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
    editor.addButton('qr-code', {
      text: 'QR',
      icon: false,
      onclick: function () {
        editor.insertContent("&nbsp;<b>将url转成二维码，并插入编辑器</b>&nbsp;")
      }
    })
  }
})

//console.log('tinymce', tinymce);
//console.log('tinymce.activeEditor.formatter out', tinymce.activeEditor.formatter);
// tinymce.activeEditor.formatter.register('titleformat', {
//   inline: 'h2',
//   styles: {color: '#ff0000'}
// });

// tinymce.activeEditor.formatter.apply('titleformat');


var app = new Vue({
  el: '#askForm',
  data: {
    isShowAskMore: false,
    message: 'Hello Vue!'
  },
  methods: {
    askMoreToggle: () => {
    }
  }
})

$(() => {
  $('textarea.autosize').on('keyup', (ev) => {
    ev.preventDefault()
    ev.currentTarget.style.height = 5 + 'px'
    ev.currentTarget.style.height = ev.currentTarget.scrollHeight + 'px'
  })
})
