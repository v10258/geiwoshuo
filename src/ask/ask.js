require('./ask.scss')

require('../layout/header.js')

var $ = require('jquery')

$.fn.serializeObject = function() {
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

require('../common/js/jquery-file-upload/jquery.fileupload.js')

var tinymce = require('../common/js/tinymce/tinymce.min.js')

import { REMOTE, axios } from '../common/js/ajax.js'

import Vue from 'vue'
import inputTag from '../common/component/input-tag.vue'
import swal from 'sweetalert'

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

tinymce.init({
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


var app = new Vue({
  el: '#askForm',
  components: {
    inputTag
  },
  data: {
    post:{},
    isShowAskMore: false,
    autoCompleteUrl: REMOTE.ask.autoComplete,
    placeholder: 'aaa',
    isLogin: false
  },
  computed: {
    isEdit: function () {
      return !!(this.post && this.post._id)
    }
  },
  created() {
    let self = this;
    self.isLogin = window.__PAGE_STATE['isLogin'];
    self.post = window.__PAGE_STATE['post'];

    //监听消息反馈
    window.addEventListener('message',function(event) {
      console.log('message event', event);
      if (event.origin && event.data && event.data.key === 'login') {
        self.isLogin = true;
      }
    },false);

  },
  methods: {
    askMoreToggle: () => {
    },
    tagsToHide (tags) {
      console.log('tags', tags);

      $('#tag').val(JSON.stringify(tags));
    },
    validate (formData) {
      let result = {
        isRight: true,
        message: ''
      }

      if (!formData.title) {
        result.isRight = false;
        result.message = '请输入标题'
      } else if (!formData.jinbi && !formData.yuan && !formData.zidingyi) {
        result.isRight = false;
        result.message = '请完善奖励'
      }
      return result;
    },
    openLogin() {
      let loginWindow = window.open('/login', 'loginWindow');
    },
    submit (ev) {
      ev.preventDefault();
      let self = this;
      let formData = $('#askForm').serializeObject();
      let validResult = self.validate(formData);
      let body = tinymce.get('editor').getContent();

      formData.body = body;

      console.log('formData', formData)
      if (!validResult.isRight) {
        // todo: 验证失败
        swal(validResult.message);
      } else if (!self.isLogin) {
        self.openLogin();
      } else {
        axios.post(REMOTE.ask.add, formData).then(function(res){
          console.log('post', res)
          location.href = res.data.data.url;
        }).catch(function(){
          console.log('catch erro ', arguments)
        })
      }
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
