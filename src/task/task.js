
require('./task.scss');
require('../layout/header.js');
require('../layout/footer.js');

import scrollTo from 'jquery.scrollto'
import Vue from 'vue/dist/vue.js'
import {mapState, mapGetters} from 'vuex';
import { REMOTE, ajax } from '../common/js/ajax.js'

import taskAction from './component/task-action.vue'
import taskProcess from './component/task-process.vue' 
import taskAnswer from './component/task-answer.vue'
import taskAnswerForm from './component/task-answer-form.vue' 
import follow from './component/follow.vue'
import store from './store/store'

var app = new Vue({
  el: '#content',

  store,

  components: {
    taskAction,
    taskProcess,
    taskAnswer,
    taskAnswerForm,
    follow
  },

  // data: {
  //   joinChecked: false,
  //   anonymousChecked: false
  // },

  // 把stroe.js中的值，赋值给组件里data中的值
  // computed: {
  //   ...mapState([
  //     'qid',
  //     'pageNum',
  //     'pageSize',
  //     'answers',
  //     'sort',
  //   ]),
  //   ...mapGetters([
  //     'answerCount'
  //   ])
  // },

  created() {
    
    // 初始化 store
    store.commit('merge', window.__PAGE_DATA)

    // todo: 下拉加载
  },

  methods: {
    btnWriteAnswer(type) {
      this.$store.commit('set', {
        joinChecked: type === 1 ? false : true
      })
      scrollTo('#answer', 300);
    }
  }
})
