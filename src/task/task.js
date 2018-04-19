
require('./task.scss');
require('../layout/header.js');
require('../layout/footer.js');

import scrollTo from 'jquery.scrollto'
import Vue from 'vue'
import store from './store/store'

import taskAction from './component/task-action.vue'
import taskProcess from './component/task-process.vue' 
import taskAnswer from './component/task-answer.vue'
import answerForm from './component/answer-form.vue' 
import follow from './component/follow.vue'

var app = new Vue({
  el: '#content',

  store,

  data(){
    return {
      store: store.state
    }
  },

  watch:{
    'store.ownAnswer': function(newVal, oldVal) {
      if ((!oldVal && newVal) ||  (oldVal && oldVal.body !== newVal.body)) {
        location.reload();
      }
      console.log('watch', arguments);
    }
  },

  components: {
    taskAction,
    taskProcess,
    taskAnswer,
    answerForm,
    follow
  },

  created() {
    // 初始化 store
    store.commit('merge', window.__PAGE_STATE)

    // todo: 下拉加载
  },

  methods: {
    btnWriteAnswer(type) {
      this.$store.commit('set', {
        isAnswerActive: true,
        joinChecked: type === 1 ? false : true
      })
      scrollTo('#answer', 300);
    }
  }
})
