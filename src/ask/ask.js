require('./ask.scss');

require('../layout/header.js');

var $ = require('jquery');

import Vue from 'vue/dist/vue.js';


var app = new Vue({
  el: '#askForm',
  data: {
    isShowAskMore: false,
    message: 'Hello Vue!'
  },
  methods: {
      askMoreToggle: ()=>{}
  }
})

$(()=> {
    $('textarea.autosize').on('keyup', (ev)=>{
        ev.preventDefault();
        ev.currentTarget.style.height = 5 + 'px';
        ev.currentTarget.style.height = ev.currentTarget.scrollHeight + 'px';
    })
})