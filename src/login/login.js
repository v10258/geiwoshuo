
import Vue from 'vue'
import store from './store/store'
import loginForm from './component/login-form.vue'

import './login.scss'

var app = new Vue({
  el: '#content',

  store,

  data: {
    type: 'login',
  },

  components: {
    loginForm
  },

  created () {
    const self = this

    store.commit('set', {
      type: self.queryString('type') || self.type
    })
  },

  methods: {
    queryString: (item) => {
      var svalue = location.search.match(new RegExp('[?&]' + item + '=([^&]*)(&?)', 'i'))
      return svalue ? svalue[1] : ''
    }
  }
})

console.log(app)
