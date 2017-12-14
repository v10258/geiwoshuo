require('./index.scss')

require('../layout/header.js')
require('../layout/footer.js')

import Vue from 'vue'
import {REMOTE, ajax} from '../common/js/ajax.js';
import topHeader from './component/top-header.vue'
import questionIndex from './component/question-index.vue'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
import store from './store'

Vue.use(Element)

var app = new Vue({
  el: '#content',

  store,

  components: {
    topHeader,
    questionIndex
  },

  data: {
    pageSize: 20,
    posts: []
  },

  computed: {
    pageNum () {
      return this.$store.state.pageNum
    },
    pageCount() {
      return this.$store.state.pageCount
    }
  },

  created() {
    var self = this;

    store.commit('init', {
      pageCount: Math.ceil(window.__PAGE_INITAL.totalCount/self.pageSize),
      pageNum: 1
    })
  },

  methods: {
    switchSort (type, pageNum) {
      let self = this;
		  let params = {
        type: type,
        pageNum: pageNum
      };

      self.sort = type;
      self.pageNum = pageNum;

      ajax({
          url: REMOTE.index.queryQuestions,
          params
      }).then((data)=>{
        self.posts = data.list;
      })
    }
  }
})
