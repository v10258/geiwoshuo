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
  getQuestions (context, playload) {
    let params = Object.assign({
      sort: context.state.sort,
      pageNum: context.state.pageNum,
      pageSize: context.state.pageSize
    }, playload);

    context.commit('set', params);

    ajax(
      REMOTE.index.queryQuestions,
      params
    ).then((data)=>{
      context.commit('set', {
        posts: data.list,
        postCount: data.count
      });
    })
  },

  vote(context, playload) {
    let post = context.state.posts[playload.index];
    let newPosts = playload.op === 'up' ? {...post, upvotes: (post.upvotes + 1)} :
      {...post, downvotes: (post.downvotes - 1)};

    ajax(
      REMOTE.task.doVote + `/${post._id}`,
      {
        op: playload.op
      }
    ).then((data)=>{
      context.commit('set', {
        posts: newPosts
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
