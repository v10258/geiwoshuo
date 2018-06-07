
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
import loadMore from '../common/component/load-more.vue'
import pageview from '../common/component/pageview.vue'

var app = new Vue({
  el: '#content',

  store,

  components: {
    taskAction,
    taskProcess,
    taskAnswer,
    answerForm,
    follow,
    taskRelated,
    loadMore,
    pageview
  },

  data: {
    post: {},
  },

  computed: {
    loading () {
      return this.$store.state.loading
    },
    isShowLoadMore () {
      return (this.$store.state.answers && this.$store.state.answers.length > 1) &&
        (this.$store.state.totalPages > 1)
    },
    atLast () {
      return (this.$store.state.totalPages > 1) && (this.$store.state.pageNum >= this.$store.state.totalPages)
    }
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
    },
    handlePageDown () {
      if (this.$store.state.pageNum >= this.$store.state.totalPages) return
      console.log('trigger handlePageDown pageNum+1')
      this.$store.commit('set', {
        pageNum: this.$store.state.pageNum + 1
      })
    }
  }
})

console.log('page task', app)
