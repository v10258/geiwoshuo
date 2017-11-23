

<template>
  <section class="top-header">
    <nav class="top-header-nav">
      <a :class="{ active: in_sort ==='hot' }" @click="sortHandler('hot')" href="javascript:;">热门</a>
      <a :class="{ active: in_sort ==='latest' }" @click="sortHandler('latest')" href="javascript:;">最新</a>
      <a :class="{ active: in_sort ==='bounty' }" @click="sortHandler('bounty')" href="javascript:;">赏金</a>
      <a :class="{ active: in_sort ==='promo' }" @click="sortHandler('promo')" href="javascript:;">推广</a>
    </nav>
    <div class="top-header-pager">
      <a class="ion ion-ios-arrow-back" @click="quantityMinus" href="javascript:;"></a>
      <span class="vm-num"><i>{{in_pageNum}}</i>/{{pageCount}}</span>
      <a class="ion ion-ios-arrow-forward" @click="quantityPlus" href="javascript:;"></a>
    </div>
  </section>
</template>

<script>
const $ = require("jquery");

export default {
  props: {
    sort: {
      type: String,
      default: "hot"
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageCount: {
      type: Number,
      default: 1
    }
  },

  data: function () {
    return { 
      in_sort: this.sort,
      in_pageNum: this.pageNum
    }
  },

  methods: {
    quantityMinus() {
      if (this.in_pageNum > 1) {
        this.in_pageNum--;
        this.emitMessage();
      }
    },

    quantityPlus() {
      if (this.in_pageNum < this.pageCount) {
        this.in_pageNum++;
        this.emitMessage();
      }
    },

    sortHandler (type) {
      if (type === this.in_sort) return;
      this.in_sort = type;
      this.in_pageNum = 1;
      this.emitMessage();
    },

    emitMessage () {
      this.$emit('message', this.in_sort, this.in_pageNum);
    }
  }
};
</script>