require('./ask.scss')

require('../layout/header.js')

var $ = require('jquery')

require('../common/js/jquery-file-upload/jquery.fileupload.js')

var tinymce = require('../common/js/tinymce/tinymce.min.js')

import { REMOTE } from '../common/js/ajax.js'

import Vue from 'vue/dist/vue.js'
import inputTag from '../common/component/inputTag.vue'

tinymce.init({
  selector: 'textarea#editor',
  menubar: false,
  plugins: ['autoresize lists link hr'],
  toolbar: ['editor-control image imagegws qr-code',
  'undo redo | titleformat bold italic |  bullist numlist | link hr | removeformat'],
  block_formats: '标题=h2;代码块=pre',

  // 编辑区域应用样式
  content_css: '/css/ask.css',
  content_style: 'p {margin:0; line-height: 1.5;}',

  // 去掉商标和路径
  branding: false,
  elementpath: false,

  // 图片上唇
  //image_description: false,
  //image_dimensions: false,
  images_upload_url: REMOTE.ask.ImagUupload,
  automatic_uploads: true,
  // images_upload_handler: function (blobInfo, success, failure) {
  //   console.log('handler arguments', arguments)
  //   //setTimeout(function () {
  //     // no matter what you upload, we will turn it into TinyMCE logo :)
  //     success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png')


  //   //}, 2000)
  // },

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
  }
})

console.log('inputTag', inputTag, REMOTE.ask.autoComplete);

var app = new Vue({
  el: '#askForm',
  components: {
    inputTag
  },
  data: {
    isShowAskMore: false,
    autoCompleteUrl: REMOTE.ask.autoComplete,
    placeholder: 'aaa',
    tags: [{name:'投票', sid: '111'}, {name:'陪玩', sid: '222'}]
  },
  methods: {
    askMoreToggle: () => {
    },
    tagsToHide (tags) {
      console.log('tags', tags);

      $('#tag').val(JSON.stringify(tags));
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
