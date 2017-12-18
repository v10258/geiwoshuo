<template>

<section class="task-process">
  <p class="task-process-step">
    流程：响应问题（
    <span class="text-success">{{processList[0]}}人</span>） —> 确认完成（
    <span class="text-success">{{processList[1]}}人</span>） —> 获得报酬（
    <span class="text-success">{{processList[2]}}人</span>）
  </p>
  <p class="task-process-state">
    该问题已经有交付申请，等待发布者复核，继续提交可能无法被被采纳。
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
