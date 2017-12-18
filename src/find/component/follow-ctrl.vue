<template>

<section class="follow-ctrl">
  <div class="follow-ctrl-tags">
    <div class="mod-hd">
      已关注标签
    </div>
    <div v-if="interestTags && interestTags.length" class="mod-interest">
      <a v-for="(tag, index) in interestTags" @click="activeTag(tag.tid)" :key="index" href="#">{{tag.name}}</a>
    </div>
    <div v-if="recommendTags && recommendTags.length" class="mod-recommend">
      <a v-for="(tag, index) in recommendTags" @click="activeTag(tag.tid)" :key="index" href="#">{{tag.name}}</a>
    </div>
  </div>

  <div class="follow-ctrl-console">
    <h2>全部</h2>
    <div class="mod-rank">
      <span :class="['vm-tab', rank === 'hot' ? 'active' : '']" @click.prevent="switchRank('hot')" data-href="#">热门排序</span>
      <span class="vm-line">|</span>
      <span :class="['vm-tab', rank === 'date' ? 'active' : '']" @click.prevent="switchRank('date')" data-href="#">时间排序</span>
    </div>
  </div>
</section>

</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {

  computed: {
    ...mapState([
      'interestTags',
      'recommendTags',
      'rank'
    ])
  },

  methods: {
    activeTag(tid) {
      this.$store.dispatch('queryRelatedQuestions', {
        activeTid: tid
      })
    },
    switchRank(rank) {
      if (this.rank === rank) return
      this.$store.dispatch('queryRelatedQuestions', {
        rank: rank,
        pageNum: 1
      });
    }
  }
};
</script>
