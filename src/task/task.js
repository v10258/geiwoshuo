
require('./task.scss');
require('../layout/header.js');
require('../layout/footer.js');

require('./js/follow.js');

var $ = require('jquery')

var scrollTo = require('jquery.scrollto')

import Vue from 'vue/dist/vue.js'
import { REMOTE } from '../common/js/ajax.js'

import taskFooter from './component/task-footer.vue' 
import answerEditor from './component/answer-editor.vue' 
import taskAnswer from './component/task-answer.vue'

var app = new Vue({
  el: '#contentColumn',

  components: {
    answerEditor,
    taskAnswer,
    taskFooter
  },

  data: {
    // 回答 - 当前页数
    pageNum: 1,

    // 回答 - 每次家在数量
    pageSize: 10,

    // 回答类型： 1回答、2响应
    joinChecked: false,

    // 是否匿名
    anonymousChecked: false
  },

  created() {
    var self = this;

    // todo: 下拉加载
  },

  methods: {
    btnWriteAnswer(type) {
      if (type === 1) {
        this.joinChecked = false;
      } else {
        this.joinChecked = true;
      }
      scrollTo('#answer', 300);
    },

    answerSubmit(ev) {
      let qid = ev.target.dataset.qid;

    }
  }
})
