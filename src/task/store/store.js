import Vue from 'vue'
import Vuex from 'vuex'
import { REMOTE, ajax } from '../../common/js/ajax.js'

Vue.use(Vuex)

// root state object.
const state = {
  // 问题id
  qid: '',

  // 获赞数
  vote: '',

  // 分类过滤
  sort: 'all',

  // 排序
  rank: 'hot',

  // 初始化页码
  pageNum: 1,

  // 初始化页面每次请求记录数
  pageSize: 20,

  // 任务进度列表
  processList: [],

  // 回答
  answers: [],

  // 是否响应
  joinChecked: false,

  // 是否匿名
  anonymousChecked: false,

  // 回答内容
  body: ''
}

const getters = {
  answerCount: state => state.answers.length,
  actorNum: state => state.answers.reduce(function(accumulator, currentValue){
    if (currentValue.join) {
      return ++accumulator;
    } else {
      return accumulator;
    }
  }, 0),
  upvote: (state) => { return state.vote >= 0 ? state.vote : '' },
  downvote: (state) => { return state.vote < 0 ? -state.vote : '' }
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
  // vote (context, playload) {

  //   let newProp = playload.op === 'upvote' ? {upvotes: (post.upvotes + 1)} :
  //   {downvote: (post.downvotes - 1)};

  //   ajax(
  //     REMOTE.task.op + `/${context.state.qid}`,
  //     {
  //       op: playload.op
  //     }
  //   ).then((data)=>{
  //     context.commit('set', newProp);
  //   })
  // },

  getAnswers (context, playload) {
    let params = Object.assign({
      sort: context.state.sort,
      rank: context.state.rank,
      pageNum: context.state.pageNum,
      pageSize: context.state.pageSize
    }, playload);

    context.commit('set', params);

    ajax(
      REMOTE.task.queryAnswers + `/${context.state.qid}`,
      params
    ).then((data)=>{
      console.log('getAnswers data', data)
      context.commit('set', {
        answers: data
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
