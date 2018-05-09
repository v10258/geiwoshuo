
import './task.scss'
import '../layout/header.js'
import '../layout/footer.js'

import scrollTo from 'jquery.scrollto'
import Vue from 'vue'
import store from './store/store'

import taskAction from './component/task-action.vue'
import taskProcess from './component/task-process.vue'
import taskAnswer from './component/task-answer.vue'
import answerForm from './component/answer-form.vue'
import follow from './component/follow.vue'
import taskRelated from './component/task-related.vue'

var app = new Vue({
  el: '#content',

  store,

  components: {
    taskAction,
    taskProcess,
    taskAnswer,
    answerForm,
    follow,
    taskRelated
  },

  created () {
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
