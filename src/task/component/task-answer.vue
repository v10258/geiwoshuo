
<template>

<section class="answer" v-if="answers && answers.length || ownAnswer">
  <div class="answer-header flex-justify-between">
    <nav class="mod-nav">
      <a :class="{ active: sort ==='all' }" @click.prevent="switchSort('all')" href="#">全部回答<span>{{answerCount}}</span></a>
      <a :class="{ active: sort ==='actor', disabled: actorNum === 0 }" @click.prevent="switchSort('actor')" href="#">只看响应<span>{{actorNum}}</span></a>
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
          <a class="vm-avatar" v-bind:dataUid="ownAnswer.creator._id" v-bind:href="'/profile?uid=' + ownAnswer.creator._id" :style="{backgroundImage: 'url('+ ownAnswer.creator.avatar +')'}"></a>
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
            <button @click="doVoteMe('upvote')" class="btn btn-sm btn-light">
                <i class="ion ion-md-thumbs-up"></i>
                {{ownAnswer.upvotes - ownAnswer.downvotes}}
            </button>
            <button @click="doVoteMe('downvote')" class="btn btn-sm btn-light">
                <i class="ion ion-md-thumbs-down"></i>
            </button>
          </div>
          <a @click="comment" href="javascript:;">
            <i class="ion ion-md-text"></i>
            回复
          </a>
          <a @click="doMeEditor" href="javascript:;">
            <i class="ion ion-md-create"></i>
            编辑
          </a>
          <a @click="more" href="javascript:;">
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
    <article class="answer-article"  v-for="(answer, index) in answers" :key="answer.uid">
      <div class="answer-article-hd">
          <p class="mod-user">
          <a class="vm-avatar" v-bind:dataUid="answer.creator" v-bind:href="'/profile?uid=' + answer.creator._id" :style="{backgroundImage: 'url('+ answer.creator.avatar +')'}"></a>
          <a class="vm-nickname" v-bind:dataUid="answer.creator" v-bind:href="'/profile?uid=' + answer.creator._id">{{answer.creator.name}}</a>
          </p>
          <p class="mod-sign" title="签名">，{{answer.creator.signature}}</p>
      </div>
      <div class="answer-article-body" v-html="answer.body" >
      </div>
      <div class="answer-article-addition">
          <span class="vm-date">{{answer.created}}</span>
      </div>
      <div class="answer-article-ft">
        <div class="mod-action">
          <div class="vm-thumbs">
            <button @click="doVote('upvote', index)" class="btn btn-sm btn-light">
              <i class="ion ion-md-thumbs-up"></i>
              {{answer.upvotes - answer.downvotes}}
            </button>
            <button @click="doVote('downvote', index)" class="btn btn-sm btn-light">
              <i class="ion ion-md-thumbs-down"></i>
            </button>
          </div>
          <a @click="comment(index)" href="javascript:;">
            <i class="ion ion-md-text"></i>
            回复
          </a>
          <a @click="favorite(index)" href="javascript:;">
            <i class="ion ion-md-star"></i>
            收藏
          </a>
          <a @click="reward(index)" href="javascript:;">
            <i class="ion ion-md-heart"></i>
            打赏
          </a>
          <a @click="more(index)" href="javascript:;">
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
import { mapState, mapGetters } from "vuex"
import errorHandler from '../../common/js/error.js'

export default {
  // 把stroe.js中的值，赋值给组件
  computed: {
    ...mapState(["sort", "rank", "ownAnswer", "answers", 'pageNum']),
    ...mapGetters(["answerCount", "actorNum"])
  },

  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    pageNum: function(newVal, oldVal) {
      console.log('pageNum', newVal)
      if (newVal <= oldVal) return

      this.$store.dispatch('getAnswers', {
        pageNum: newVal
      })
    }
  },

  methods: {
    doMeEditor() {
      this.$emit("into-editor", {
        type: "into-editor"
      });
      console.log("into-editor emit");
    },

    switchSort(sort) {
      if (this.actorNum === 0 || this.sort === sort) return;
      this.$store.dispatch("getAnswers", {
        sort: sort,
        pageNum: 1
      });
    },
    switchRank(rank) {
      if (this.rank === rank) return;
      this.$store.dispatch("getAnswers", {
        rank: rank,
        pageNum: 1
      });
    },

    doVote(op, index){
      this.$store.dispatch('vote', {
        op: op,
        index: index
      })
      .then(data => {
        const copyAnswers = this.$store.state.answers.slice()
        const answer = copyAnswers[index]

        copyAnswers[index] = op === 'upvote' ? { ...answer, upvotes: (answer.upvotes + 1) } :
          { ...answer, downvotes: (answer.downvotes + 1) }

        this.$store.commit('set', {
          answers: copyAnswers
        });
      })
      .catch(err => {
        console.log('catch err', err)
        errorHandler(err)
      });
    },

    doVoteMe(op) {
      const ownAnswer = this.$store.state.ownAnswer;
      this.$store.dispatch('vote', {
        op: op
      })
      .then(data => {
        const newOwnAnswer =  op === 'upvote' ? { ...ownAnswer, upvotes: (ownAnswer.upvotes + 1) } :
          { ...ownAnswer, downvotes: (ownAnswer.downvotes + 1) }

        this.$store.commit('set', {
          ownAnswer: newOwnAnswer
        });
      })
      .catch(err => {
        console.log('catch err', err)
        errorHandler(err)
      });
    },

    comment() {

    },

    favorite () {

    },

    reward () {

    },

    more () {

    }
  }
};
</script>
