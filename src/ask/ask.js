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

import { REMOTE, axios } from '../common/js/ajax.js'

import Vue from 'vue'
import inputTag from '../common/component/input-tag.vue'
import swal from 'sweetalert'
import editorLive from '../common/js/editor-live.js'

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
      let body = editorLive.get('editor').getContent();

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
