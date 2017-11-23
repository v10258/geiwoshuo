require('./index.scss')

require('../layout/header.js')
require('../layout/footer.js')

const $ = require('jquery');

import {REMOTE} from '../common/js/ajax.js';
import Vue from 'vue/dist/vue.js'
import topHeader from './component/top-header.vue'
import questionIndex from './component/question-index.vue'

var app = new Vue({
  el: '#contentColumn',

  components: {
    topHeader,
    questionIndex
  },

  data: {
    sort: 'hot',
    pageNum: 1,
    pageCount: 20,
    posts: []
  },

  created() {
    var self = this;
  },

  watch: {
    navActive() {
      this.queryQuestions();
    }
  },
  methods: {
    switchSort (type, pageNum) {
      let self = this;
		  let params = {
        type: type,
        pageNum: pageNum
      };

      $.ajax({
          url: REMOTE.index.queryQuestions,
          type: 'get',
          data: params,
          dataType: 'json'
      }).done((result)=>{
        if (!result.success) return;

        self.posts = result.data.list;
      })
    }
  }
})
