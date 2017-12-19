import Vue from 'vue'
import Vuex from 'vuex'
import { REMOTE, ajax } from '../../common/js/ajax.js'

Vue.use(Vuex)

// root state object.
const state = {
  rank: 'hot',
  pageNum: 1,
  pageSize: 20,
  activeTag: '',
  interestTags:[],
  recommendTags: [],
  questions: []
}

const getters = {
  tags(state) {
    let tagData = state.interestTags.length ? state.interestTags : state.recommendTags;
    return tagData.reduce(function(accumulator, currentVal){
      console.log('accumulator, currentVal', accumulator, currentVal)
      accumulator[currentVal.tid] = currentVal.name
    }, {})
  }
  //pageCount: state => Math.ceil(state.postCount/state.pageSize)
}

const mutations = {
  // 新增和设置
  set(state, opts) {
    if (Object.prototype.toString.call({}).toLowerCase() !== '[object object]') return;
    for (let p in opts) {
      if (state[p] === undefined) {
        Vue.set(state, p, opts[p])
      } else {
        state[p] = opts[p];
      }
    }
  },
  // 合并
  merge(state, opts) {
    this.replaceState(Object.assign(state, opts));
  }
}

// actions are functions that cause side effects and can involve asynchronous operations.
const actions = {
  getTags() {

  },
  getTeams() {

  },
  queryRelatedQuestions (context, playload) {
    let params = Object.assign({
      rank: context.state.rank,
      pageNum: context.state.pageNum,
      pageSize: context.state.pageSize,
      activeTag: context.state.activeTag
    }, playload);

    ajax(
      REMOTE.find.relatedQuestions,
      params
    ).then((data)=>{
      console.log('queryRelatedQuestions data', data)
      params.posts = data;
      context.commit('set', params);
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
