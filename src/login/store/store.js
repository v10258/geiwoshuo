import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// root state object.
const state = {
  type: 'login',
  loginType: 1
}

const getters = {}

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

const actions = {}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
