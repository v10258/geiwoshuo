var $ = require('jquery')

import Vue from 'vue/dist/vue.js'
import { REMOTE } from '../../common/js/ajax.js';


var componentTmpl = `
<div>
  <div class="foucus-question">
    <span class="add-attention" @click="doFollow">
      <i>+</i>
      关注问题
    </span>
  </div>
  <div class="attention-people">
    <div class="a-people new-small-font">
      <span class="allAttentionPeople">{{counts}}</span>
      人关注了此问题
    </div>
    <ul id="a-user-list">
      <li v-for="user in users">
        <a class="usr-ico usr-info-btn" :href="user.url" v-bind:style="{ color: 'red', backgroundImage: 'url(' + user.avatar + ')' }">
        </a>
      </li>
    </ul>
  </div>
</div>
`;

Vue.component('gws-concerns', {
  props: ['qid'],

  data: function () {
    return {
      users: []
    }
  },

  computed: {
    counts: function () {
      return this.users.length || 0;
    }
  },

  template: componentTmpl,

  created() {
    this.getTaskFollow(this.qid);
  },

  methods: {
    getTaskFollow (qid) {
      console.log('qid', qid);
      $.ajax({
        url: `/post/${this.qid}/follows`,
        type: 'get',
        dataType: 'json'
      }).done((result) => {
        if (!result.success) return;
        console.log();
        this.users = result.data.users;
      })
    },

    doFollow (){
      $.ajax({
        url: `/post/${this.qid}/subscribe`,
        type: 'post',
        dataType: 'json'
      }).done((result) => {
        if (!result.success) return;
        this.users.push(result.data);
      })
    }
  }
})

var app = new Vue({
  el: '.concerns'
})
