import Vue from 'vue'
import Vuex from 'vuex'
import { REMOTE, ajax } from '../../common/js/ajax.js'

Vue.use(Vuex)

// root state object.
const state = {
  sort: 'hot',
  pageNum: 1,
  pageSize: 20,
  postCount:0,
  posts: []
}

const getters = {
  pageCount: state => Math.ceil(state.postCount/state.pageSize)
}

const mutations = {
  init(state, opts) {
    for (var p in opts) {
      if (opts.hasOwnProperty(p)) {
        Vue.set(state, p, opts[p])
      }
    }
  },

  merge(state, opts) {
    this.replaceState(Object.assign(state, opts));
  }
}

// actions are functions that cause side effects and can involve asynchronous operations.
const actions = {
  getQuestions (context, playload) {

    ajax(
      REMOTE.index.queryQuestions,
      {
        pageNum: playload.pageNum,
        sort: playload.sort,
        pageSize: context.state.pageSize
      }
    ).then((data)=>{
      context.commit('merge', {
        posts: data.list,
        sort: playload.sort,
        pageNum: playload.pageNum
      });
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
