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

import Vue from 'vue/dist/vue.js'
import inputTag from '../common/component/inputTag.vue'

tinymce.init({
  selector: 'textarea#editor',
  menubar: false,
  plugins: ['autoresize link'],
  toolbar: ['link imagegws qr-code'],

  // 编辑区域应用样式
  content_style: ' p {margin:0; line-height: 1.5;}',

  // 去掉商标和路径
  branding: false,
  elementpath: false,

  // 图片上传
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

    editor.addButton('imagegws', {
      icon: 'image',
      onclick: function () {
        $('#fileupload').fileupload({
          url: REMOTE.ask.fileupload,
          dataType: 'json',
          done: function (ev, data) {
            console.log('result', data.result);
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
      icon: '',
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
    tags: []
  },
  watch: {
    tags: function () {
      this.$el.querySelector('#tags').value = JSON.stringify(this.tags);
    }
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
    submit (ev) {
      ev.preventDefault();
      let self = this;
      let formData = $('#askForm').serializeObject();
      let validResult = self.validate(formData);
      let body = tinymce.get('editor').getContent();

      formData.body = body;

      console.log('formData', formData)
      if (validResult.isRight) {

        axios.post(REMOTE.ask.add, formData).then(function(res){
          console.log('post', res)
          location.href = res.data.data.url;
        }).catch(function(){
          console.log('catch erro ', arguments)
        })

      } else {
        // todo: 验证失败
        alert(validResult.message);
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
