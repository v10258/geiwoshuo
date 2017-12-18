
<template>

<section class="questions" id="questions">
  <article class="question-summary" v-for="(item, index) in questions" :key="index">
    <div class="question-sumary-title">
      请业内老司机帮忙分析良渚文化村和翡翠城地段优劣和未来发展潜力。
    </div>
    <div class="question-sumary-author">
      <p class="mod-user">
        <a class="vm-avatar" data-uid="24cd6162636131633563662559" href="/pai/center?uid=24cd6162636131633563662559" style="background-image: url(https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D450%2C600/sign=21612f75580fd9f9a0425d6d101df81c/f703738da977391279828568f1198618367ae217.jpg);"></a>
        <a class="vm-nickname" data-uid="5cd06162633437343533669408" href="/pai/center?uid=5cd06162633437343533669408">尤慕</a>
      </p>
      <p class="mod-sign" title="我愿变成童话拟，里爱的辣个天使">，我愿变成童话拟，里爱的辣个天使</p>
    </div>
    <div class="question-sumary-content">
      <div class="mod-preview">

      </div>
      <div class="mod-answer">
          A difficult and unique medical degree?? Well.. there is only one medical degree. 
          There isnt any other type. A medical degree is very simple to acquire, it only requires hardwork and requires lot of...
          <a class="vm-all text-success" href="#">显示全部</a>
      </div>
    </div>
    <div class="question-sumary-bt">
      <div class="mod-action">
          <a>
              <i class="ion ion-md-add"></i>
              关注
          </a>
          <a>
              <i class="ion ion-md-star"></i>
              收藏
          </a>
          <a>
              <i>•</i>
              1394 个回答
          </a>
      </div>
    </div>
    <div class="question-sumary-stats">
      <a href="#">1.6K</a>
    </div>
  </article>
  <slot v-if="!questions.length">

  </slot>
</section>

</template>


<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'questions'
    ])
  }
}
</script>
