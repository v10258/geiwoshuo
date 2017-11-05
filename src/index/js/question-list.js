var $ = require('jquery');

import Vue from 'vue/dist/vue.js';
import {REMOTE} from '../../common/js/ajax.js';

var app = new Vue({
  el: '.content-column',
  data: {
    navActive: 'hot',
    pagenum: 1
  },

  created() {
    var self = this;
  },

  watch: {
    navActive() {
      this.queryQuestions();
    }
  },

  methods: {
    queryQuestions: function(){
      let self = this;
		  var params = {
        type: self.navActive,
        pagenum: self.pagenum
      };

      $.ajax({
          url: REMOTE.index.queryQuestions,
          type: 'get',
          data: params,
          dataType: 'json'
      }).done((result)=>{
        if (!result.sucess) return;
        // todo
      })
		}
  }
})
