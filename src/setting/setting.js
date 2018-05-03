require('./setting.scss')
require('../layout/header.js')
require('../layout/footer.js')

import 'babel-polyfill'
import Vue from 'vue'
import cropUpload from 'vue-image-crop-upload'

import { REMOTE, ajax } from '../common/js/ajax.js'

var app = new Vue({
  el: '#content',

  data: {
    show: false,
    user: null,
    params: {},
    imgDataUrl: ''
  },

  components: {
    'my-upload': cropUpload
  },

  created() {
    var self = this;
    
    if (__PAGE_STATE && __PAGE_STATE.user) {
      self.user = __PAGE_STATE.user;
    }
  },

  methods: {
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------', imgDataUrl)
      this.imgDataUrl = imgDataUrl
    },
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------')
      console.log(jsonData)
      console.log('field: ' + field)
    },
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  }
})

$('#profileForm').on('submit', (e) => {
  e.preventDefault()

  ajax(
    REMOTE.user.settingInfo,
    new URLSearchParams(new FormData(e.target)),
    'post'
  ).then((data) => {
    console.log('data', data);
  })
})
