import Vue from 'vue'
import Vuex from 'vuex'
import { REMOTE, ajax } from '../../common/js/ajax.js'

Vue.use(Vuex)

// root state object.
const state = {
  rank: 'hot',
  pageNum: 1,
  pageSize: 20,
  questions: []
}

const getters = {
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
  getQuestions (context, playload) {
    let params = Object.assign({
      sort: context.state.sort,
      pageNum: context.state.pageNum,
      pageSize: context.state.pageSize
    }, playload);

    ajax(
      REMOTE.index.queryQuestions,
      params
    ).then((data)=>{
      console.log('queryQuestions data', data)
      params.posts = data;
      context.commit('merge', params);
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
