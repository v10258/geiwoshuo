
<template>

<section class="questions" id="questions">
  <article class="index-summary" v-for="(post, index) in posts" :key="post._id" >
    <img class="-avatar" :src="post.creatorAvatar || 'http://b3-q.mafengwo.net/s10/M00/48/B5/wKgBZ1kAeeiAXfnNAABXZKqrvCE90.jpeg?imageMogr2%2Fthumbnail%2F%2190x90r%2Fgravity%2FCenter%2Fcrop%2F%2190x90%2Fquality%2F90'">
    <div class="-title">
      <a :href="'/post/' + post._id" target="_blank">{{post.title}}</a>
      <!-- <i>多人任务</i>
      <i>全网任务</i>
      <i>奖励丰厚</i> -->
    </div>
    <div class="-body">
      <!-- <div class="-pic">
        <img src="http://b1-q.mafengwo.net/s10/M00/B4/7A/wKgBZ1nnO_mATOH1ADFwguwdC9858.jpeg?imageMogr2%2Fthumbnail%2F%21140x105r%2Fgravity%2FCenter%2Fcrop%2F%21140x105%2Fquality%2F90" width="150" height="100">
      </div> -->

      <div class="-text" v-html="post.content_abstract.text || post.title">
      </div>
    </div>
    <div class="-info">
      <a v-for="tag in post.tags" href="#" :key="tag.tid" >{{tag.name}}</a>
      <span>发布于 5 小时前</span>
    </div>
    <div class="-action">
      <div>
        <a :href="'/post/' + post._id" target="_blank" title="回答，关注和浏览">
          <i class="ion ion-md-text"></i>
          {{ post.trends }} 动态
        </a>
        <a>
          <i class="ion ion-ios-eye"></i>
          {{post.pageviews ? post.pageviews : 1}} 浏览
        </a>
        <a class="-more">
          <i class="ion ion-ios-more"></i>
        </a>
      </div>
      <div class="-thumbs">
        <button class="btn btn-sm btn-light ion-md-arrow-dropup" @click="doVote('upvote', index)" title="支持">
          {{post.upvotes - post.downvotes}}
        </button>
        <button class="btn btn-sm btn-light ion-md-arrow-dropdown" @click="doVote('downvote', index)" title="反对">
        </button>
      </div>
    </div>
  </article>
</section>

</template>


<script>

import Vue from 'vue'
import { mapState, mapGetters, mapMutations } from "vuex";
import { REMOTE, ajax } from '../../common/js/ajax.js';
import errorHandler from '../../common/js/error.js';

export default {
  computed: {
    posts () {
      return this.$store.state.posts.map(post=>{
        let vote = (post.upvotes - post.downvotes) > 0 ? post.upvotes - post.downvotes : 0
        Vue.set(post, 'trends', post.pageviews + post.subscribers.length + vote);
        return post
      })
    }
  },
  methods: {
    doVote(op, index){
      this.$store.dispatch('vote', {
        op: op,
        index: index
      })
      .then(data => {
        const copyPosts = this.$store.state.posts.slice()
        const post = copyPosts[index]

        copyPosts[index] = op === 'upvote' ? { ...post, upvotes: (post.upvotes + 1) } :
          { ...post, downvotes: (post.downvotes + 1) }

        this.$store.commit('set', {
          posts: copyPosts
        });
      })
      .catch(err => {
        console.log('catch err', err)
        errorHandler(err)
      });
    }
  }
};
</script>
