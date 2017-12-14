
require('./task.scss');
require('../layout/header.js');
require('../layout/footer.js');

import scrollTo from 'jquery.scrollto'
import Vue from 'vue/dist/vue.js'
import { REMOTE, ajax } from '../common/js/ajax.js'

import taskFooter from './component/task-footer.vue'
import taskAnswer from './component/task-answer.vue'
import answerEditor from './component/answer-editor.vue' 
import follow from './component/follow.vue'

var app = new Vue({
  el: '#content',

  components: {
    taskFooter,
    taskAnswer,
    answerEditor,
    follow
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
      let eleForm = this.$el.querySelector('#editor');

      ajax(
        REMOTE.task.comment + `/${this.qid}`,
        {
          body: eleForm.value
        }
      )
      .then(function(data){
        console.log('comment', arguments)
        location.reload();
      })
    }
  }
})
