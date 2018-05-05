
<template>

<section class="answer" v-if="answers && answers.length || ownAnswer">
  <div class="answer-header flex-justify-between">
      <nav class="mod-nav">
        <a :class="{ active: sort ==='all' }" @click.prevent="switchSort('all')" href="#">全部回答<span>{{answerCount}}</span></a>
        <a :class="{ active: sort ==='actor' }" @click.prevent="switchSort('actor')" href="#">只看响应<span>{{actorNum}}</span></a>
      </nav>
      <div class="mod-rank">
        <span :class="['vm-tab', rank === 'hot' ? 'active' : '']" @click.prevent="switchRank('hot')" data-href="#">热门排序</span>
        <span class="vm-line">|</span>
        <span :class="['vm-tab', rank === 'date' ? 'active' : '']" @click.prevent="switchRank('date')" data-href="#">时间排序</span>
      </div>
  </div>
  <div class="answer-list">
    <article class="answer-article answer-mine" v-if="ownAnswer">
      <div class="answer-article-hd">
          <p class="mod-user">
          <a class="vm-avatar" v-bind:dataUid="ownAnswer.creator._id" v-bind:href="'/profile?uid=' + ownAnswer.creator._id" style="background-image: url(https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D450%2C600/sign=21612f75580fd9f9a0425d6d101df81c/f703738da977391279828568f1198618367ae217.jpg);"></a>
          <a class="vm-nickname" v-bind:dataUid="ownAnswer.creator._id" v-bind:href="'/profile?uid=' + ownAnswer.creator._id">{{ownAnswer.creator.name}}</a>
          </p>
          <p class="mod-sign" title="签名">，{{ownAnswer.creator.signature}}</p>
      </div>
      <div class="answer-article-body" v-html="ownAnswer.body" >
      </div>
      <div class="answer-article-addition">
          <span class="vm-date">{{ownAnswer.created}}</span>
      </div>
      <div class="answer-article-ft">
          <div class="mod-action">
          <div class="vm-thumbs">
              <button class="btn btn-sm btn-light">
                  <i class="ion ion-md-thumbs-up"></i>
                  {{ownAnswer.upvotes - ownAnswer.downvotes}}
              </button>
              <button class="btn btn-sm btn-light">
                  <i class="ion ion-md-thumbs-down"></i>
              </button>
          </div>
          <a>
              <i class="ion ion-md-text"></i>
              回复
          </a>
          <a>
              <i class="ion ion-md-star"></i>
              编辑
          </a>
          </div>
          <div class="mod-pack">
          <a href="#">
              收起
          </a>
          </div>
      </div>
    </article>
    <article class="answer-article"  v-for="answer in answers" :key="answer.uid">
      <div class="answer-article-hd">
          <p class="mod-user">
          <a class="vm-avatar" v-bind:dataUid="answer.creator" v-bind:href="'/profile?uid=' + answer.creator" style="background-image: url(https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D450%2C600/sign=21612f75580fd9f9a0425d6d101df81c/f703738da977391279828568f1198618367ae217.jpg);"></a>
          <a class="vm-nickname" v-bind:dataUid="answer.creator" v-bind:href="'/profile?uid=' + answer.creator">昵称</a>
          </p>
          <p class="mod-sign" title="签名">，我愿变成童话拟，里爱的辣个天使</p>
      </div>
      <div class="answer-article-body" v-html="answer.body" >
      </div>
      <div class="answer-article-addition">
          <span class="vm-date">{{answer.created}}</span>
      </div>
      <div class="answer-article-ft">
          <div class="mod-action">
          <div class="vm-thumbs">
              <button class="btn btn-sm btn-light">
                  <i class="ion ion-md-thumbs-up"></i>
                  {{answer.upvotes - answer.downvotes}}
              </button>
              <button class="btn btn-sm btn-light">
                  <i class="ion ion-md-thumbs-down"></i>
              </button>
          </div>
          <a>
              <i class="ion ion-md-text"></i>
              回复
          </a>
          <a>
              <i class="ion ion-md-star"></i>
              收藏
          </a>
          <a>
              <i class="ion ion-md-heart"></i>
              打赏
          </a>
          <a>
              <i class="ion ion-ios-more"></i>
              </a>
          </div>
          <div class="mod-pack">
          <a href="#">
              收起
          </a>
          </div>
      </div>
    </article>
    <slot v-if="!answers.length">

    </slot>
  </div>
</section>
<section class="answer-empty" v-else>
  快来响应问题，获取奖励~
</section>

</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {

  // 把stroe.js中的值，赋值给组件
  computed: {
    ...mapState([
      'sort',
      'rank',
      'ownAnswer',
      'answers',
    ]),
    ...mapGetters([
      'answerCount',
      'actorNum'
    ])
  },

  methods: {
    switchSort(sort) {
      if (this.sort === sort) return
      this.$store.dispatch('getAnswers', {
        sort: sort,
        pageNum: 1
      });
    },
    switchRank(rank) {
      if (this.rank === rank) return
      this.$store.dispatch('getAnswers', {
        rank: rank,
        pageNum: 1
      });
    }
  }
};
</script>
