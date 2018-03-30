
<template>

<section class="follow">
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

import { mapState, mapGetters } from 'vuex'
import { REMOTE, ajax } from '../../common/js/ajax.js'

export default {

  computed: {
    ...mapState([
      'post'
    ]),
    counts: function () {
      return this.users.length || 0;
    }
  },

  data: function () {
    return {
      users: []
    }
  },

  created() {
    this.getTaskFollow();
  },

  methods: {
    getTaskFollow () {
      let self = this;

      ajax(
        REMOTE.task.taskFollows + `/${self.post._id}`
      )
      .then(function(data){
        self.users = data;
      })
    },

    doFollow (){
      let self = this;

      ajax(
        REMOTE.task.doFollow + `/${self.post._id}`
      )
      .then(function(data){
        self.users.push(data);
      })
    }
  }
};
</script>
