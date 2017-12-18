
<template>
  <section class="hot-tag">
    <div class="-header">
      <h3 class="-title">热门标签</h3>
      <a class="-more" href="#">标签广场</a>
    </div>
    <ul class="-list">
      <li class="-item">
        <a class="-avatar" href="#" style="background-image: url(https://avatars1.githubusercontent.com/u/6301319?v=3&amp;s=460);background-size: cover;">
        </a>
        <div class="-info">
          <a class="-name">
            股票
          </a>
          <p class="-follow">
            275266 人关注
          </p>
        </div>
        <a class="-link" href="#" target="_blank">
          如何看待饿了么以 8 亿美元收购百度外卖？可能带来哪些影响？
        </a>
      </li>
      <li class="-item">
        <a class="-avatar" href="#" style="background-image: url(https://avatars1.githubusercontent.com/u/6301319?v=3&amp;s=460);background-size: cover;">
        </a>
        <div class="-info">
          <a class="-name">
            股票
          </a>
          <p class="-follow">
            275266 人关注
          </p>
        </div>
        <a class="-link" href="#" target="_blank">
          如何看待饿了么以 8 亿美元收购百度外卖？可能带来哪些影响？
        </a>
      </li>
      <li class="-item">
        <a class="-avatar" href="#" style="background-image: url(https://avatars1.githubusercontent.com/u/6301319?v=3&amp;s=460);background-size: cover;">
        </a>
        <div class="-info">
          <a class="-name">
            股票
          </a>
          <p class="-follow">
            275266 人关注
          </p>
        </div>
        <a class="-link" href="#" target="_blank">
          如何看待饿了么以 8 亿美元收购百度外卖？可能带来哪些影响？
        </a>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      'hotTags'
    ])
  }
};
</script>
