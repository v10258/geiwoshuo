
<template>

<section class="related">
  <div class="mod-tit">相关推荐</div>
  <ul class="related-list">
    <li v-for="post in posts" :key="post._id">
      <a href="/question/34526162633933393939610400">{{post.title}}</a>
      <span class="new-small-font">{{post.answerNum}}个回答</span>
    </li>
  </ul>
</section>

</template>

<script>
import { REMOTE, remoteUrlCombine, ajax } from "../../common/js/ajax.js";

export default {
  data: function () {
    return {
      posts: null
    };
  },

  created () {
    let reqUrl = remoteUrlCombine(REMOTE.task.related, {
      post_id : this.$store.state.post._id
    });

    ajax(reqUrl).then((data) => {
      this.posts = data;
    })
  }
};
</script>

<style lang="scss">
</style>


