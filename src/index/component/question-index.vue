
<template>

<section class="questions" id="questions">
  <article class="index-summary" v-for="(post, index) in posts" :key="post._id" >
    <div class="-title">
      <a :href="'/post/' + post._id" target="_blank">{{post.title}}</a>
    </div>
    <div class="-info">
      <a v-for="tag in post.tags" href="#" :key="tag.tid" >{{tag.name}}</a>
      <span>发布于 5 小时前</span>
    </div>
      <div class="-action">
        <div class="-thumbs">
          <button class="btn btn-sm btn-light" @click="doVote('up', index)" title="支持">
            <i class="ion ion-md-arrow-dropup"></i>
            {{post.upvotes - post.downvotes >= 0 ? post.upvotes: ''}}
          </button>
          <button class="btn btn-sm btn-light" @click="doVote('down', index)" title="反对">
            <i class="ion ion-md-arrow-dropdown"></i>
            {{post.downvotes - post.upvotes > 0 ? post.downvotes : ''}}
          </button>
        </div>
        <a :href="'/post/' + post._id" target="_blank" title="回复，响应和打赏">
          <i class="ion ion-md-text"></i>
          {{post.trends }} 动态
        </a>
        <a>
          <i>•</i>
          {{post.views || Math.ceil(Math.random() * 9)}} 浏览
        </a>
        <a class="-more">
          <i class="ion ion-ios-more"></i>
          <!-- 举报 -->
        </a>
    </div>
  </article>
</section>

</template>


<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState(["posts"])
  },
  methods: {
    doVote(op, index){
      this.$store.dispatch('vote', {
        op: op,
        index: index
      });
    }
  }
};
</script>
