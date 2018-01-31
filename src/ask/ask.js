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
import site from '../common/js/site.js'
import editorLive from '../common/js/editor-live.js'

var app = new Vue({
  el: '#askForm',
  components: {
    inputTag
  },
  data: {
    hotTags: {},
    post:{},
    city: {},
    isShowAskMore: false,
    isShowEditor: false,
    autoCompleteUrl: REMOTE.ask.autoComplete,
    placeholder: 'aaa',
    isLogin: false
  },

  created() {
    let self = this;
    self.isLogin = window.__PAGE_STATE['isLogin'];
    self.hotTags = window.__PAGE_STATE['hotTags'];
    self.post = window.__PAGE_STATE['post'];

    console.log('created', self, self.hotTags)

    self.post.coins = self.post.coins && '';
    self.post.bounty = self.post.bounty && '';
    self.city = (this.post._id && this.post.city) ? (site.citys[this.post.city] || site.defaultCity) : site.defaultCity; 

    console.log('city', self.city)

    //监听消息反馈
    window.addEventListener('message',function(event) {
      console.log('message event', event);
      if (event.origin && event.data && event.data.key === 'login') {
        self.isLogin = true;
      }
    },false);
  },
  methods: {
    showEditorToggle: () => {
      console.log('showEditorToggle', this)
    },
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
      } else if (!formData.coins && !formData.bounty && !formData.custom) {
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
      console.log('formData', formData);

      // todo: 验证失败
      if (!validResult.isRight) {
        swal(validResult.message);
        return;
      }
      
      // 未登录
      if (!self.isLogin) {
        self.openLogin();
      }

      // 传值和表单存在 post_id 为编辑
      if (formData.post_id && this.post._id) {
        axios.put(REMOTE.ask.update, formData).then(function(res){
          console.log('post', res)
          location.href = res.data.data.url;
        }).catch(function(){
          console.log('catch erro ', arguments)
        })
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
