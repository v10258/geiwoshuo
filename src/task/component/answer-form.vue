

<template>

<form class="answer-form" v-show="!ownAnswer || isAnswerActive" name="answer" id="answer">
  <div class="answer-form-title">
    我来回答：
  </div>

  <div class="answer-form-editor ui-editor">
    <textarea class="autosize" id="editor" name="body" rows="3" placeholder="关于问题的详细描述">
      {{answerbody}}
    </textarea>
    <input style="display:none;" id="fileupload" type="file" name="files" multiple>
  </div>

  <div class="answer-form-addons">
    <div class="mod-tips">
      <p v-if="joinChecked">
        响应代表参与解决问题，你的回答将被标记，同时发布者会收到通知，经发布者确认完成后获得报酬。
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

var editorTodo = {
  imagegwsHandler: function (editor) {
    $('#fileupload').fileupload({
      url: REMOTE.ask.fileupload,
      done: function (ev, data) {
        console.log('result', data.result);
        let result = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        editor.insertContent(`<img src="${result.data.files[0].url}">`);
      },
      progressall: function (ev, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          console.log('progress', progress);
      }
    }).trigger('click');
  },
  qrCodeHandler: function (editor) {
    editor.insertContent("&nbsp;<b>将url转成二维码，并插入编辑器</b>&nbsp;")
  },
  initHandler: function (editor) {
    console.log('Editor: ' + editor.id + ' is now initialized.')
  }
}

tinymce.init({
  selector: 'textarea#editor',
  menubar: false,
  plugins: ['autoresize lists link  fullscreen'],
  //toolbar: ['bold italic title blockquote |  bullist numlist link hr | imagegws', 'fullscreen'],
  toolbar: ['bold blockquote  bullist numlist | link imagegws qr-code', 'fullscreen'],

  // 编辑区域应用样式
  content_style: 'p {margin:0; line-height: 1.5;} img {max-width: 600px;max-height: 800px;}',

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

  convert_urls: false,

  //
  setup: function (editor) {
    editor.addButton('imagegws', {
      icon: 'image',
      onclick: function () {
        editorTodo.imagegwsHandler(editor)
      }
    })

    editor.addButton('qr-code', {
      text: 'QR',
      icon: false,
      onclick: function () {
        editorTodo.qrCodeHandler(editor)
      }
    })

    // editor.addButton('title', {
    //   text: 'H',
    //   icon: false,
    //   onclick: function() {
    //     editor.execCommand('mceToggleFormat', false, 'h2');
    //   },

    //   onpostrender: function() {
    //     var btn = this;
    //     editor.on('init', function() {
    //       editor.formatter.formatChanged('h2', function(state) {
    //         btn.active(state);
    //       });
    //     });
    //   }
    // });
  }
})

export default {
  computed: {
    ...mapState([
      'ownAnswer',
      'isAnswerActive'
    ]),
    answerbody () {
       return this.$store.state.ownAnswer ? this.$store.state.ownAnswer.body : '';
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
      let body = tinymce.get('editor').getContent({format: 'raw'});
              
      return this.$store.dispatch('answerSubmit', {
        body: body
      }).then(()=>{
        location.reload();
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
