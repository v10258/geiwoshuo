<template>

<div class="task-action">
    <div class="vm-thumbs">
        <button class="btn btn-sm btn-light" @click="doVote('upvote')" title="支持">
            <i class="ion ion-md-arrow-dropup"></i>
            {{post.upvotes - post.downvotes}}
        </button>
        <button class="btn btn-sm btn-light" @click="doVote('downvote')" title="反对">
            <i class="ion ion-md-arrow-dropdown"></i>
        </button>
    </div>
    <a @click="invite" href="javascript:;">
        <i class="ion ion-md-person-add"></i>
        邀请
    </a>
    <a @click="share" title="分享问题，邀请朋友参与完成，您将获得丰厚奖励，问题解决者将获得平台额外报酬。</p>">
        <i class="ion ion-md-share-alt"></i>
        分享
    </a>
    <a>
    <i class="ion ion-ios-more"></i>
        <!-- 举报 -->
    </a>
</div>

</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {

  computed: {
    ...mapState([
      'post'
    ])
  },

  methods: {
    doVote(op){
      this.$store.dispatch('vote', {
        op: op
      });
    },

    invite() {
      //this.$store.dispatch('invite')
    },

    share() {
      //this.$store.dispatch('share')
    }
  }
};
</script>
