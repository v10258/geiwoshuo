

<template>

<form class="answer-form" name="answer" id="answer">
  <div class="answer-form-title">
    我来回答：
  </div>

  <div class="answer-form-editor ui-editor">
    <textarea class="autosize" id="editor" name="body" rows="3" placeholder="关于问题的详细描述"></textarea>
    <input style="display:none;" id="fileupload" type="file" name="files[]" multiple>
  </div>

  <div class="answer-form-addons">
    <div class="mod-tips">
      <p v-if="joinChecked">
        响应代表参与解决问题，你的回答将被标记，同时发布者会收到通知，解决问题后可以确认完成，由问题发布者发放报酬。
      </p>
      <p v-if="anonymousChecked">
        此回答不会显示你的用户信息，也不会出现在个人动态中。
      </p>
    </div>
    <div class="mod-action">
      <div class="mod-option">
        <label class="vm-unname mr10">
          <input type="checkbox" name="join" v-model="joinChecked">
          <span>响应</span>
        </label>
        <label class="vm-unname">
          <input type="checkbox" name="anonymous" v-model="anonymousChecked">
          <span>匿名</span>
        </label>
      </div>

      <div class="mod-submit">
        <a class="bs-btn bs-btn-primary bs-btn-small" data-qid="5a03177322aa7975e3a577cd" @click="answerSubmit" href="javascript:;">
          提交回答
        </a>
      </div>
    </div>
  </div>
</form>
</template>

<script>
var $ = require('jquery')
var tinymce = require('../../common/js/tinymce/tinymce.min.js')
require('../../common/js/jquery-file-upload/jquery.fileupload.js')

import { REMOTE, ajax } from '../../common/js/ajax.js'

import { mapState, mapGetters } from 'vuex'

tinymce.init({
  selector: 'textarea#editor',
  menubar: false,
  plugins: ['autoresize lists link hr fullscreen'],
  toolbar: ['bold italic title blockquote |  bullist numlist link hr | imagegws', 'fullscreen'],

  // 编辑区域应用样式
  content_style: ' p {margin:0; line-height: 1.5;}',

  // 去掉商标和路径
  branding: false,
  elementpath: false,

  // 图片上传
  //image_description: false,
  //image_dimensions: false,
  images_upload_url: REMOTE.ask.ImagUupload,
  automatic_uploads: true,

  // 编辑器初始化回调
  init_instance_callback: function (editor) {
    console.log('Editor: ' + editor.id + ' is now initialized.')
  },

  //输入框区域自动变大
  autoresize_min_height: 60,
  autoresize_max_height: 360,
  autoresize_bottom_margin: 30,

  // 
  setup: function (editor) {
    editor.addButton('editor-control', {
      text: 'B',
      icon: false,
      onclick: function (e) {
        var $elem = $(e.target);
        $elem = $elem.hasClass('mce-txt') ? $elem.parent() : $elem;
        if ($elem.hasClass('active')) {
          $elem.removeClass('active');
          $('.mce-toolbar.mce-last').hide();
        } else {
          $elem.addClass('active');
          $('.mce-toolbar.mce-last').show();
        }
      }
    })
    editor.addButton('imagegws', {
      icon: 'image',
      onclick: function () {
        $('#fileupload').fileupload({
          url: REMOTE.ask.fileupload,
          dataType: 'json',
          done: function (ev, data) {
            editor.insertContent(`<img src="${data.result.data.files[0].url}">`);
          },
          progressall: function (e, data) {
              var progress = parseInt(data.loaded / data.total * 100, 10);
              console.log('progress', progress);
          }
        }).trigger('click');
      }
    })
    
    editor.addButton('qr-code', {
      text: 'QR',
      icon: false,
      onclick: function () {
        editor.insertContent("&nbsp;<b>将url转成二维码，并插入编辑器</b>&nbsp;")
      }
    })

    editor.addButton('title', {
      text: 'H',
      icon: false,
      onclick: function() {
        editor.execCommand('mceToggleFormat', false, 'h2');
      },
    
      onpostrender: function() {
        var btn = this;
        editor.on('init', function() {
          editor.formatter.formatChanged('h2', function(state) {
            btn.active(state);
          });
        });
      }
    });    
  }
})

export default {
  created() {

  },
  computed: {
    ...mapState([
      'qid'
    ]),
    body () {
       return this.$store.state.body
    },
    joinChecked: {
      get () {
        return this.$store.state.joinChecked
      },
      set (value) {
        console.log('joinChecked', value);
        this.$store.commit('set', {
          joinChecked: value
        })
      }
    },
    anonymousChecked: {
      get () {
        return this.$store.state.anonymousChecked
      },
      set (value) {
        console.log('anonymousChecked', value);
        this.$store.commit('set', {
          anonymousChecked: value
        })
      }
    }
  },

  methods: {
    answerSubmit() {
      let self = this;
      let state = this.$store.state;
      let body = tinymce.get('editor').getContent();

      console.log('answerSubmit', {
        body: body,
        joinChecked: state.joinChecked,
        anonymousChecked: state.anonymousChecked
      })

      ajax(
        REMOTE.task.comment + `/${self.qid}`,
        {
          body: body,
          joinChecked: state.joinChecked,
          anonymousChecked: state.anonymousChecked
        }
      ).then((data)=>{
        console.log('data', data)
        //location.reload();
      })
    }
  }
};
</script>

<style>
.ui-editor {
    position: relative;
}

.ui-editor .mce-statusbar {
    border: none;
}
.ui-editor .mce-statusbar .mce-path {
    display: none;
}

.ui-editor .mce-toolbar.mce-last {
    position: absolute;
    right: 0;
    top: 0;
}
</style>
