
<template>
  <section class="top-header">
    <nav class="top-header-nav">
      <a :class="{ active: sort ==='hot' }" @click="switchSort('hot')" href="javascript:;">热门</a>
      <a :class="{ active: sort ==='latest' }" @click="switchSort('latest')" href="javascript:;">最新</a>
      <a :class="{ active: sort ==='bounty' }" @click="switchSort('bounty')" href="javascript:;">赏金</a>
      <a :class="{ active: sort ==='promo' }" @click="switchSort('promo')" href="javascript:;">推广</a>
    </nav>
    <div class="top-header-pager">
      <a class="ion ion-ios-arrow-back" @click="pageNumMinus()" href="javascript:;"></a>
      <span class="vm-num"><i>{{pageNum}}</i>/{{pageCount}}</span>
      <a class="ion ion-ios-arrow-forward" @click="pageNumPlus()" href="javascript:;"></a>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {

  computed: {
    ...mapState([
      'sort',
      'pageNum'
    ]),
    ...mapGetters([
      'pageCount'
    ])
  },

  methods: {
    pageNumMinus() {
      if (this.pageNum > 1) {
        this.$store.dispatch('getQuestions', {
          sort: this.sort,
          pageNum: this.pageNum - 1
        });
      }
    },
    pageNumPlus() {
      if (this.pageNum < this.pageCount) {
        this.$store.dispatch('getQuestions', {
          sort: this.sort,
          pageNum: this.pageNum + 1
        });
      }
    },
    switchSort(sort) {
      if (this.sort === sort) return
      this.$store.dispatch('getQuestions', {
        sort: sort,
        pageNum: 1
      });
    }
  }
};
</script>