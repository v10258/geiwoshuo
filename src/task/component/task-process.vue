<template>

<section class="task-process">
  <p class="task-process-step">
    流程：
    写回答 —> 
    参与响应（<span class="text-success">{{processList[1]}}人</span>） —> 
    获得报酬（<span class="text-success">{{processList[2]}}人</span>）
  </p>
  <p class="task-process-state" v-if="processList && processList[1] === 0">
    该问题期待你的参与~
  </p>
  <p class="task-process-state" v-else-if="processList && processList[1] > 0">
    有热心用户响应问题，一起参与吧~
  </p>
  <p class="task-process-state" v-else-if="processList && processList[2] > 3">
    该问题已有多人响应，等待发布者确认，继续提交可能无法被被采纳。
  </p>
</section>

</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {

  computed: {
    ...mapState([
      'processList'
    ])
  },

  methods: {

  }
};
</script>
