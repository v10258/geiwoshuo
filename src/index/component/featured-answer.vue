
<template>

<section class="hot-answer">
  <div class="-header">
    <h3 class="-title">精选回答</h3>
  </div>
  <ul class="-list">
    <li class="-item" v-for="answer in answers" :key="answer.answerId">
      <a class="-title" :href="'/post/' + answer._id">
      {{ answer.title}}
      </a>
      <a class="-preview" :href="'/post/' + answer._id">
        <p class="-content" v-html="answer.content_abstract.text"></p>
        <div class="-image" v-if="answer.content_abstract.thumbnail" :style="{backgroundImage: 'url('+ answer.content_abstract.thumbnail +')', backgroundSize: cover}"></div>
      </a>
    </li>
  </ul>
</section>

</template>

<script>
import { REMOTE, ajax } from "../../common/js/ajax.js";

export default {
  data: function () {
    return {
      answers: []
    }
  },

  created () {
    ajax(REMOTE.index.featuredAnswer).then((data) => {
      this.answers = data.slice(0, 3);
    })
  }
};
</script>

<style lang="scss">
</style>