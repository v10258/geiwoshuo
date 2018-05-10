
<template>

<div class="pageview" style="display:none;">
  <span>stats-url: {{statsUrl}}</span>
  <span>stats-parameter: {{statsParameter}}</span>
</div>

</template>

<script>
import { REMOTE, ajax } from "../../common/js/ajax.js";

export default {
  name: 'pageview',

  props: {
    page: {
      type: String,
      default: ''
    },
    ident: {
      type: String,
      default: ''
    },
    extParameters: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      statsUrl: REMOTE.task.op + `/${this.ident}`,
      statsParameter: {
        op: 'pageview'
      }
    }
  },

  created () {
    const self = this;

    if (!self.page) return;

    switch (self.page) {
      case 'post': {
        self.doTask();
        break;
      }
      case 'index': {

      }
      default:;
    }
  },

  methods: {
    doTask() {
      ajax(
        this.statsUrl,
        this.statsParameter,
        'post'
      )
    }
  }
};
</script>
