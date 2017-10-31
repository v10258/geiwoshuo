require('./login.scss');


var $ = require('jquery');

import Vue from 'vue/dist/vue.js';


var app = new Vue({
  el: '#loginForm',
  data: {
  	type: 'login',
  	loginType: 1,
    isShowAskMore: false,
    message: 'Hello Vue!'
  },

  created() {
  	var self = this;
    //获取备用数据
    self.type = this.queryString('type') || self.type;
  },

  watch: {
    type() {
      console.log('type', this.type);
    },

    loginType() {
    	console.log('loginType', this.loginType);
    }
  },

  methods: {
    queryString: (item)=>{
		  var svalue = location.search.match(new RegExp('[?&]' + item + '=([^&]*)(&?)', 'i'));
		  return svalue ? svalue[1] : '';
		}
  }
})

$(()=> {
    
})