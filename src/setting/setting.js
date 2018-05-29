import './setting.scss'
import '../layout/header.js'
import '../layout/footer.js'

import Vue from 'vue'
import cropUpload from 'vue-image-crop-upload'
import { REMOTE, ajax } from '../common/js/ajax.js'

const __PAGE_STATE = window.__PAGE_STATE

var app = new Vue({
  el: '#content',

  data: {
    show: false,
    user: {},
    params: {},
    imgDataUrl: ''
  },

  components: {
    'my-upload': cropUpload
  },

  created () {
    if (__PAGE_STATE && __PAGE_STATE.user) {
      this.user = __PAGE_STATE.user
    }
  },

  methods: {
    toggleShow () {
      this.show = !this.show
    },
    cropSuccess (imgDataUrl, field) {
      console.log('-------- crop success --------', imgDataUrl)
      this.user.avatar = imgDataUrl
    },
    cropUploadSuccess (result, field) {
      console.log('-------- upload success --------')
      console.log(result)
      console.log('field: ' + field)
    },
    cropUploadFail (status, field) {
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
    console.log('data', data)
  })
})

console.log(app)
