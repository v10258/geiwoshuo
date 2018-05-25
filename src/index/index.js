import './index.scss'
import '../layout/header.js'
import '../layout/footer.js'

import Vue from 'vue'
import {mapState, mapGetters} from 'vuex'

import topHeader from './component/top-header.vue'
import questionIndex from './component/question-index-pic.vue'
import featuredAnswer from './component/featured-answer.vue'
import { Pagination } from 'element-ui'

import store from './store/store'
import scrollTo from 'jquery.scrollto'

Vue.use(Pagination)

var app = new Vue({
  el: '#content',

  store,

  components: {
    topHeader,
    questionIndex,
    featuredAnswer
  },

  // 把stroe.js中的值，赋值给组件里data中的值
  computed: {
    ...mapState([
      'pageNum',
      'pageSize',
      'posts',
      'sort'
    ]),
    ...mapGetters([
      'pageCount'
    ])
  },

  created () {
    // 初始化 store
    store.commit('merge', window.__PAGE_STATE)
  },

  methods: {
    handleSizeChange (val) {
      if (val === this.pageNum) return
      this.$store.dispatch('getQuestions', {
        sort: this.sort,
        pageNum: val
      })
      scrollTo(0, 300)
    }
  }
})

console.log(app)
