
<template>

<section class="questions" id="questions">
    <article class="index-summary" v-for="post in posts" >
        <div class="-title">
            <a href="/task/${post.id}">{{post.title}}</a>
        </div>
        <div class="-info">
            <a v-for="tag in post.tags" href="#">{{tag.name}}</a>
            <span>发布于 5 小时前</span>
        </div>
        <div class="-action">
            <div class="-thumbs">
            <button class="btn btn-sm btn-light" title="支持">
            <i class="ion ion-md-arrow-dropup"></i>
            100
        </button>
            <button class="btn btn-sm btn-light" title="反对">
            <i class="ion ion-md-arrow-dropdown"></i>
        </button>
            </div>
            <a title="回复，响应和打赏">
            <i class="ion ion-md-text"></i>
            99 动态
        </a>
            <a>
            <i>•</i>
            1394 浏览
        </a>
            <a class="-more">
        <i class="ion ion-ios-more"></i>
            <!-- 举报 -->
        </a>
        </div>
    </article>
    <slot v-if="!posts.length">

    </slot>
</section>

</template>


<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState([
      'posts'
    ])
  }
}
</script>
