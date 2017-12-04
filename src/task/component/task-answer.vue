
<template>

<section class="task-answer">
  <div class="task-answer-header flex-justify-between">
      <nav class="mod-nav">
        <a :class="{ active: sort ==='all' }" @click.prevent="sortHandler('all')" href="#">全部回答<span>{{answerNum}}</span></a>
        <a :class="{ active: sort ==='actor' }" @click.prevent="sortHandler('actor')" href="#">只看响应<span>{{actorNum}}</span></a>
      </nav>
      <div class="mod-rank">
        <span :class="['vm-tab', rank === 'hot' ? 'active' : '']" @click.prevent="rankHandler('hot')" data-href="#">热门排序</span>
        <span class="vm-line">|</span>
        <span :class="['vm-tab', rank === 'date' ? 'active' : '']" @click.prevent="rankHandler('date')" data-href="#">时间排序</span>
      </div>
  </div>
  <div class="task-answer-list">
    <article class="answer-article"  v-for="answer in answers" :key="answer.uid">
      <div class="answer-article-hd">
          <p class="mod-user">
          <a class="vm-avatar" data-uid="24cd6162636131633563662559" href="/pai/center?uid=24cd6162636131633563662559" style="background-image: url(https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D450%2C600/sign=21612f75580fd9f9a0425d6d101df81c/f703738da977391279828568f1198618367ae217.jpg);"></a>
          <a class="vm-nickname" data-uid="5cd06162633437343533669408" href="/pai/center?uid=5cd06162633437343533669408">萦萦宝贝儿</a>
          </p>
          <p class="mod-sign" title="我愿变成童话拟，里爱的辣个天使">，我愿变成童话拟，里爱的辣个天使</p>
      </div>
      <div class="answer-article-body">
          楼主，还记得那年大明湖畔的夏雨荷吗？
      </div>
      <div class="answer-article-addition">
          <span class="vm-date">2017-07-18</span>
      </div>
      <div class="answer-article-ft">
          <div class="mod-action">
          <div class="vm-thumbs">
              <button class="btn btn-sm btn-light">
                  <i class="ion ion-md-thumbs-up"></i>
                  16
              </button>
              <button class="btn btn-sm btn-light">
                  <i class="ion ion-md-thumbs-down"></i>
              </button>
          </div>
          <a>
              <i class="ion ion-md-text"></i>
              回复
          </a>
          <!-- <a>
              <i class="ion ion-md-star"></i>
              收藏
          </a> -->
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

</template>

<script>
const $ = require("jquery");
import { REMOTE } from '../../common/js/ajax.js'

export default {
  name: "TaskAnswer",

  props: {
    qid: {
      type: String,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      sort: 'all',
      rank: 'hot',
      answers: [],
      answerNum: 0,
      actorNum: 0
    };
  },

  created () {
    let self = this;

    self.answerCount();
  },

  methods: {
    sortHandler (type) {
      if (type === this.sort) return;
      this.sort = type;
      this.rank = 'hot';
      this.queryAnswers();
    },
    rankHandler (type) {
      if (type === this.sort) return;
      this.rank = type;
      this.queryAnswers();
    },
    queryAnswers () {
      let self = this;
		  let params = {
        qid: this.qid,
        type: this.type,
        rank: this.rank,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };

      $.ajax({
          url: REMOTE.task.queryAnswers,
          type: 'get',
          data: params,
          dataType: 'json'
      }).done((result)=>{
        if (!result.success) return;

        self.answers = result.data;
      })
    },
    answerCount() {
      $.ajax({
          url: REMOTE.task.queryAnswerCount,
          type: 'get',
          data: {
            qid: this.qid
          },
          dataType: 'json'
      }).done((result)=>{
        if (!result.success) return;

        self.answerNum = result.data.answerNum;
        self.actorNum = result.data.actorNum;
      })
    }
  }
};
</script>
