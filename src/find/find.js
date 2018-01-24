
require('./find.scss');
require('../layout/header.js');
require('../layout/footer.js');

import Vue from 'vue'
import {mapState, mapGetters} from 'vuex';
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
import store from './store/store'

import followCtrl from './component/follow-ctrl.vue'
import followQuestion from './component/follow-question.vue'
import hotTag from './component/hot-tag.vue'
import hotTeam from './component/hot-team.vue'

Vue.use(Element)

var app = new Vue({
  el: '#content',

  store,

  components: {
    followCtrl,
    followQuestion,
    hotTag,
    hotTeam
  },

  // 把stroe.js中的值，赋值给组件里data中的值
  computed: {
    ...mapState([
      'pageNum'
    ])
  },

  created() {
    // 初始化 store
    store.commit('merge', window.__PAGE_STATE);

    // 请求加载热门标签
    store.dispatch('getTags');

    // 请求加载热门团队
    store.dispatch('getTeams');

    // todo: 下拉加载更多...
  },

  methods: {
    loadMore() {
      this.$store.dispatch('getRelatedQuestions', {
        // sort: this.sort,
        // pageNum: val
      })
    }
  }
})
