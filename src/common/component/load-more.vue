
<template>

<div class="load-more">
  <span class="load-more-no" v-if="atLast">没有更多数据了...</span>
  <a class="load-more-btn" v-else  @click="openMore" href="javascript:;">加载更多<i></i></a>
</div>

</template>

<script>

export default {
  name: 'loadMore',

  props: {
    buffer: {
      type: Number,
      default: 200
    },
    atLast: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loadmoreOpen: false
    };
  },

  created() {
    this.onScroll();
  },

  methods: {
    openMore() {
      this.loadmoreOpen = true
      this.delayEvent()
    },
    onScroll() {
      const self = this;
      const win = window;
      let innerHeight = win.innerHeight;
      let scrollTop;
      let scrollHeight;
      let markViewPos = 0;
      let currentViewPos;

      window.addEventListener(
        'scroll',
        () => {
          if (!self.loadmoreOpen) return;

          scrollTop = win.pageYOffset || win.document.documentElement.scrollTop || document.body.scrollTop;
          scrollHeight = win.document.documentElement.scrollHeight || document.body.scrollHeight;
          currentViewPos = scrollTop + innerHeight + this.buffer

          if ((scrollHeight <= currentViewPos) && (markViewPos <= currentViewPos) && !self.loading) {
            markViewPos = currentViewPos
            self.delayEvent()
          }
        },
        false
      );

      window.addEventListener('resize', () => {
          innerHeight = win.innerHeight
        }, false);
    },
    delayEvent() {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('pagedown', {
          type: 'pagedown'
        })
      }, 50)
    }
  }
};
</script>

<style lang="scss">
.answer-more {

  height: 35px;
  margin-top: 25px;

  a {
    display: block;
    line-height: 35px;
    text-align: center;
    text-decoration: none;
    color: #666;
    background-color: #efefef;
    border-radius: 4px;

    &:hover {
      background-color: #fff5e5;
      color: #ff9d00;
    }
  }
}
</style>

