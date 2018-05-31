export const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

export const REMOTE = {
  index: {
    queryQuestions: '/post/query',
    featuredAnswer: '/post/comments/selected',
    stat: 'post/stat'
  },
  ask: {
    autoComplete: '/tag/auto_complete',
    fileupload: '/file/upload',
    add: '/post/add',
    update: '/post/update'
  },
  task: {
    taskFollows: '/post/follows',
    doFollow: '/post/subscribe',
    queryAnswers: '/post/post_id/answers',
    queryAnswerCount: '/post/answerCount',
    op: '/post/op',
    comment: '/post/post_id/comment',
    related: '/post/post_id/related'
  },
  find: {
    relatedQuestions: 'find/related'
  },
  user: {
    login: '/user/login',
    regist: '/user/signup',
    settingInfo: '/user/setting/info'
  },
  serve: {
    captcha: '/captcha'
  }
}

export const remoteUrlCombine = function (str, mapObj) {
  let re = new RegExp(Object.keys(mapObj).join('|'), 'gi')

  return str.replace(re, function (matched) {
    return mapObj[matched]
  })
}

/**
 * ajax
 *
 * @param <String> url
 * @param <Object> params
 * @param <String> method
 * @param <String> dataType
 * @return {Promise}
 */

export const ajax = function (url, params, method = 'get', isSimple = true) {
  let data = null

  if (typeof url === 'object') {
    url = url.url
    params = url.params
    method = url.method ? url.method : method
    isSimple = url.isSimple ? url.isSimple : isSimple
  }

  if (method === 'post') {
    data = params
    params = null
  }
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: method,
      params: params,
      data: data,
      timeout: 6000
    })
      .then(function (res) {
        console.log(`url:${url} --- res:`, res)
        if (res.data.success) {
          isSimple ? resolve(res.data.data) : resolve(res)
        } else {
          reject(res.data)
        }
      })
      .catch(err => {
        console.log('网络异常，请稍后再试!')
        reject(err)
      })
  })
}
