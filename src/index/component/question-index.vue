
<template>

<section class="questions" id="questions">
  <article class="index-summary" v-for="post in posts" :key="post._id" >
    <div class="-title">
      <a href="/task/${post.id}">{{post.title}}</a>
    </div>
    <div class="-info">
      <a v-for="tag in post.tags" href="#" :key="tag.tid" >{{tag.name}}</a>
      <span>发布于 5 小时前</span>
    </div>
      <div class="-action">
        <div class="-thumbs">
          <button class="btn btn-sm btn-light" title="支持">
            <i class="ion ion-md-arrow-dropup"></i>
            {{post.upvotes - post.downvotes >= 0 ? post.upvotes: ''}}
          </button>
          <button class="btn btn-sm btn-light" title="反对">
            <i class="ion ion-md-arrow-dropdown"></i>
            {{post.downvotes - post.upvotes >= 0 ? post.downvotes : ''}}
          </button>
        </div>
        <a title="回复，响应和打赏">
          <i class="ion ion-md-text"></i>
          {{post.trends}} 动态
        </a>
        <a>
          <i>•</i>
          {{post.views}} 浏览
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
  }
};
</script>
