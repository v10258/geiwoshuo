<template>

<div class="task-body-footer">
    <div class="vm-thumbs">
        <button class="btn btn-sm btn-light" @click="upvote" title="支持">
            <i class="ion ion-md-arrow-dropup"></i>
            {{in_vote}}
        </button>
        <button class="btn btn-sm btn-light" @click="downvote" title="反对">
            <i class="ion ion-md-arrow-dropdown"></i>
            {{in_downvote}}
        </button>
    </div>
    <a @click="invite" href="javascript:;">
        <i class="ion ion-md-person-add"></i>
        邀请
    </a>
    <a @click="share" title="分享问题，邀请朋友参与完成，您将获得丰厚奖励，问题解决者将获得平台额外报酬。</p>">
        <i class="ion ion-md-share-alt"></i>
        分享
    </a>
    <a>
    <i class="ion ion-ios-more"></i>
        <!-- 举报 -->
    </a>
</div>

</template>

<script>

import { REMOTE, ajax } from '../../common/js/ajax.js'

import axios from 'axios';

export default {
  name: 'TaskAnswer',

  props: {
    qid: {
      type: String,
      required: true
    },
    vote: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      in_vote: this.vote >= 0 ? this.vote : '',
      in_downvote: this.vote < 0 ? -this.vote : ''
    }
  },

  created () {
    let self = this;
  },

  methods: {
    upvote () {
      let self = this;
      ajax(
        REMOTE.task.doVote + `/${this.qid}`,
        {
          op: 'up'
        }
      ).then(function(data){
        self.in_vote++;
      },function(message){
        alert(message);
      })
    },
    downvote (type) {
      let self = this;
      ajax(
        REMOTE.task.doVote + `/${this.qid}`,
        {
          op: 'down'
        }
      ).then(function(data){
        self.in_vote--;
      },function(message){
        alert(message);
      })
    },

    invite() {

    },

    share() {

    }
  }
};
</script>
