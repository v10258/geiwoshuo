
<template>

<section class="follow">
  <a class="follow-button" href="javascript:;" @click="doFollow">
      <i class="ion ion-md-add"></i>
      关注问题
  </a>
  <div class="attention-people">
    <p class="a-people new-small-font">
      <span class="allAttentionPeople">{{counts}}</span>
      人关注了此问题
    </p>
    <ul id="a-user-list">
      <li v-for="user in users" :key="user._id">
        <a class="usr-ico usr-info-btn" :href="user.url" :style="{ color: 'red', backgroundImage: 'url(' + user.avatar + ')' }">
        </a>
      </li>
    </ul>
  </div>
</section>

</template>

<script>
import { mapState, mapGetters } from "vuex";
import { REMOTE, ajax } from "../../common/js/ajax.js";
import swal from 'sweetalert'

export default {
  data: function() {
    return {
      counts: this.$store.state.totalSubscribed,
      users: this.$store.state.subscribers
    };
  },

  methods: {
    doFollow() {
      let self = this;

      self.$store
        .dispatch("doFollow")
        .then(function(data) {
          self.counts++;
          self.users.push(data);
        })
        .catch(message => {
          swal(message);
        });
    }
  }
};
</script>

<style lang="scss">
.follow {
  font-size: 13px;
  margin-top: 15px;
  border-bottom: 1px solid #e2e2e2;

  .follow-button {
      display: inline-block;
      width: 100px;
      height: 32px;
      line-height: 30px;
      border: 1px solid #c8d6df;
      text-align: center;
      color: #585858;
      border-radius: 5px;

      &:hover {
          background-color: #f6f9fa;
          border-color: #6da995;
          text-decoration: none;
      }

      &.hasAttention {
          background-color: #efefef;
          border: 0;
          color: #7f7f7f;
      }
  }

  .attention-people {
      margin-top: 18px;
      margin-bottom: 20px;

      .a-people {
          font-size: 13px;
          color: #585858;

          .allAttentionPeople {
              cursor: pointer;
              color: #139065;
              margin-right: 5px;
          }
      }

      #a-user-list {
          margin: 5px 0 20px;
          font-size: 0;
          max-height: 70px;
          overflow: hidden;
      }

      li {
          display: inline-block;
          position: relative;
          vertical-align: top;
          font-size: 12px;
          width: 25px;
          height: 25px;
          line-height: 40px;
          color: #fff;
          text-align: center;
          border-radius: 40px;
          margin-right: 5px;
          margin-top: 10px;

          .usr-ico {
              width: 25px;
              height: 25px;
              position: absolute;
              border-radius: 50%;
              background-position: 50% 50%;
              background-size: cover;
              left: 0;
              top: 0;
          }
      }
  }
}
</style>


