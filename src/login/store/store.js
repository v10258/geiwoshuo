import Vue from 'vue'
import Vuex from 'vuex'
import { REMOTE, ajax } from '../../common/js/ajax.js'

Vue.use(Vuex)

// root state object.
const state = {
  type: 'login',
  loginType: 1,
  captcha: '',
  captchaId: ''
}

const getters = {}

const mutations = {
  // 新增和设置
  set (state, opts) {
    for (let p in opts) {
      if (state[p] === undefined) {
        Vue.set(state, p, opts[p])
      } else {
        state[p] = opts[p]
      }
    }
  },
  // 合并
  merge (state, opts) {
    this.replaceState(Object.assign(state, opts))
  }
}

const actions = {
  getCaptcha (context, playload) {
    console.log('getCaptcha')
    ajax(
      REMOTE.serve.captcha,
      {},
      'get',
      false
    ).then((res) => {
      console.log('then resolve', res)
      context.commit('set', {
        captcha: res.data.data.captcha,
        captchaId: res.headers.captcha_id
      })
    }).catch(err => {
      console.log('getCaptcha err', err)
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
