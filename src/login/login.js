require('./login.scss');


var $ = require('jquery');

import Vue from 'vue/dist/vue.js';


var app = new Vue({
  el: '#loginForm',
  data: {
    isShowAskMore: false,
    message: 'Hello Vue!'
  },
  methods: {
      askMoreToggle: ()=>{}
  }
})

$(()=> {
    
})