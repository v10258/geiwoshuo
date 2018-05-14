
import './topic.scss'
import '../layout/header.js'
import '../layout/footer.js'

import Vue from 'vue'
import store from './store/store'

var app = new Vue({
  el: '#content',

  store,

  components: {
  },

  data: {
    post: {}
  },

  created () {
    this.post = window.__PAGE_STATE['post']
    // 初始化 store
    store.commit('merge', window.__PAGE_STATE)

    // todo: 下拉加载
  },

  methods: {
    onComptEvent: function (payload) {
      let self = this

      this.$store.commit('set', {
        isAnswerActive: !self.$store.state.isAnswerActive
      })
      this.intoEditor()
    },
    intoEditor () {
      let self = this

      setTimeout(function () {
        self.$store.state.isAnswerActive && scrollTo('#answer', 300)
      }, 0)
    },
    btnWriteAnswer (type) {
      this.$store.commit('set', {
        isAnswerActive: true,
        joinChecked: type === 1
      })
      this.intoEditor()
    }
  }
})

console.log(app)
