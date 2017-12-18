
<template>

<section class="hot-team">
  <div class="-header">
    <h3 class="-title">热门团队</h3>
    <a class="-more" @click="teamReload" href="#">换一换</a>
  </div>
  <ul class="-list">
    <li class="-item active">
      <a class="-name" href="#">投票分享</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
    <li class="-item">
      <a class="-name" href="#">律政精英</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
    <li class="-item">
      <a class="-name" href="#">诚品代购</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
    <li class="-item">
      <a class="-name" href="#">勇敢的拳头</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
    <li class="-item">
      <a class="-name" href="#">股票传道</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
    <li class="-item">
      <a class="-name" href="#">房产投资</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
    <li class="-item">
      <a class="-name" href="#">情感专家</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
    <li class="-item">
      <a class="-name" href="#">钱多多</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
    <li class="-item">
      <a class="-name" href="#">农药陪玩</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
    <li class="-item">
      <a class="-name" href="#">刷单老司机</a>
      <div class="-group">
        投票分享不求人，快速高效。
      </div>
    </li>
  </ul>
</section>

</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {

  computed: {
    ...mapState([
      'hotTags'
    ])
  },

  methods: {

    teamReload (){
      let self = this;

      ajax(
        REMOTE.task.doFollow + `/${self.qid}`
      )
      .then(function(data){
        self.users.push(data);
      })
    }
  }
};
</script>
