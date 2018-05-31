import Vue from 'vue'
import Vuex from 'vuex'
import { REMOTE, remoteUrlCombine, ajax } from '../../common/js/ajax.js'

Vue.use(Vuex)

// root state object.
const state = {

  // 问题相关
  post: {
    _id: '',
    upvotes: 0,
    downvotes: 0,
    views: 0
  },
  // 任务进度列表
  processList: [],
  
  // 分类过滤
  sort: 'all',
  // 排序
  rank: 'hot',
  // 初始化页码
  pageNum: 1,
  // 初始化页面每次请求记录数
  pageSize: 20,

  totalPages: 1,

  // 自己的回答
  ownAnswer: null,

  // 激活编辑
  isAnswerActive: false,

  // 回答
  answers: [],

  totalSubscribed: 0,

  subscribers: null,

  // 是否响应
  joinChecked: false,
  // 是否匿名
  anonymousChecked: false,
  // 回答内容
  body: ''
}

const getters = {
  qid: state => state.post._id,
  answerCount: state => state.answers.length,
  actorNum: state => state.answers.reduce(function(accumulator, currentValue){
    if (currentValue.join) {
      return ++accumulator;
    } else {
      return accumulator;
    }
  }, 0)
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
  },
  // 设置目标对象的属性
  setProp(state, playload) {
    var propName = playload.propName;
    delete playload.propName;
    state[propName] = { ...state[propName], ...playload }
  }
}

// actions are functions that cause side effects and can involve asynchronous operations.
const actions = {
  vote (context, playload) {

    let newProp = playload.op === 'upvote' ? {upvotes: (context.state.post.upvotes + 1)} :
    {downvotes: (context.state.post.downvotes + 1)};

    ajax(
      REMOTE.task.op + `/${context.state.post._id}`,
      {
        op: playload.op
      },
      'post'
    ).then((data)=>{
      context.commit('setProp', {
        propName: 'post',
        ...newProp
      });
    })
  },

  doFollow (context, payload) {
    return ajax(
      REMOTE.task.doFollow + `/${context.state.post._id}`
    )
  },

  getAnswers (context, playload) {
    let params = Object.assign({
      sort: context.state.sort,
      rank: context.state.rank,
      pageNum: context.state.pageNum,
      pageSize: context.state.pageSize
    }, playload)

    context.commit('set', params)

    const reqUrl = remoteUrlCombine(REMOTE.task.queryAnswers, {
      post_id: context.state.post._id
    })

    ajax(
      reqUrl,
      params
    ).then((data) => {
      console.log('getAnswers data', data)
      context.commit('set', {
        answers: data.answers,
        totalPages: data.totalPages,
        pageNum: data.pageNum
      })
    })
  },

  answerSubmit (context, playload) {
    const reqUrl = remoteUrlCombine(REMOTE.task.comment, {
      post_id: context.state.post._id
    })

    return ajax(
      reqUrl,
      {
        commentId: context.state.ownAnswer && context.state.ownAnswer._id,
        body: playload.body,
        joinChecked: context.state.joinChecked,
        anonymousChecked: context.state.anonymousChecked
      },
      'post'
    )
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
