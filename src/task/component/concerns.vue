
<template>

<section class="concerns">
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
</section>

</template>

<script>

import { REMOTE, ajax } from '../../common/js/ajax.js'

export default {
  name: "concerns",

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

  created() {
    this.getTaskFollow(this.qid);
  },

  methods: {
    getTaskFollow (qid) {
      console.log('qid', qid);
      let self = this;

      ajax(
        REMOTE.task.taskFollows + `/${this.qid}`
      )
      .then(function(data){
          console.log('doFollow', data);
        self.users = data.users;
      })
    },

    doFollow (){
      let self = this;

      ajax(
        REMOTE.task.doFollow + `/${this.qid}`
      )
      .then(function(data){
          console.log('taskFollows', data);
        self.users.push(data);
      })
    }
  }
};
</script>
