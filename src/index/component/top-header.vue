

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
import { mapMutations } from 'vuex'

export default {

  name: 'topHeader',

  computed: {
    sort() {
      return this.$store.state.sort
    },
    pageNum () {
      return this.$store.state.pageNum
    },
    pageCount() {
      return this.$store.state.pageCount
    }
  },

  methods: {
    ...mapMutations([
      'pageNumMinus',
      'pageNumPlus',
      'switchSort'
    ])
  }
};
</script>