
<template>

<p>
  今日问题数<strong class="attention-num">{{question}}</strong>，
  <strong class="attention-num">{{responseRate}}%</strong>问题得到响应
</p>

</template>

<script>
import { REMOTE, ajax } from "../../common/js/ajax.js";

export default {
  data: function () {
    return {
      question: 0,
      responseRate: 0
    }
  },

  created () {
    ajax(REMOTE.index.stat).then(data => {
      this.question = data.question
      this.responseRate = data.responseRate
    })
  }
};
</script>