import Vue from 'vue'
import Vuex from 'vuex'
import { REMOTE, ajax } from '../../common/js/ajax.js'

Vue.use(Vuex)

// root state object.
const state = {

  // 问题相关
  post: {}
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
    }, playload);

    context.commit('set', params);

    ajax(
      REMOTE.task.queryAnswers + `/${context.state.post._id}`,
      params
    ).then((data)=>{
      console.log('getAnswers data', data)
      context.commit('set', {
        answers: data
      });
    })
  },

  answerSubmit(context, playload) {
    return ajax(
      REMOTE.task.comment + `/${context.state.post._id}`,
      {
        commentId: context.state.ownAnswer && context.state.ownAnswer._id,
        body: playload.body,
        joinChecked: context.state.joinChecked,
        anonymousChecked: context.state.anonymousChecked
      },
      'post',
    )
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
