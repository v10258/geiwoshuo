require('./login.scss');


import Vue from 'vue';
import store from './store/store'

import loginForm from './component/login-form.vue'


var app = new Vue({
  el: '#content',

  store,

  data: {
    type: 'login',
  },

  components: {
    loginForm
  },

  created() {
  	var self = this;

    store.commit('set', {
      type: self.queryString('type') || self.type
    })
  },

  methods: {
    queryString: (item)=>{
		  var svalue = location.search.match(new RegExp('[?&]' + item + '=([^&]*)(&?)', 'i'));
		  return svalue ? svalue[1] : '';
		}
  }
})