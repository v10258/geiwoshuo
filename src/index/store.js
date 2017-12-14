import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sort: 'hot',
    pageNum: 1,
    pageCount: 10
  },

  mutations: {
    init(state, opts) {
      for (var p in opts) {
        if (opts.hasOwnProperty(p)) {
          Vue.set(state, p, opts[p])
        }
      }
    },

    pageNumPlus(state) {
      if (state.pageNum < state.pageCount) {
        state.pageNum++
      }
    },

    pageNumMinus(state) {
      if (state.pageNum > 1) {
        state.pageNum--
      }
    },

    pageNumReset(state) {
      state.pageNum = 1
    },

    switchSort(state, sort) {
      if (state.sort === sort) return
      state.sort = sort
      state.pageNum = 1
    }
  }
})
