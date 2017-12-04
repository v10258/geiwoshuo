const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';


export const REMOTE = {
  index: {
    queryQuestions: '/post/query'
  },
  task: {
    taskFollows: '/post/[\w]+/subscribe',
    doFollow: '/post/[\w]/follows',
    queryAnswers: '/post/[\w]/answers',
    queryAnswerCount: '/post/[\w]/answerCount',
    doVote:'post/vote'
  },
  ask: {
    autoComplete: '/tag/auto_complete',
    fileupload: '/ask/fileupload'
  }
}

/**
 * ajax
 *
 * @param <String> url
 * @param <Object> param
 * @param <String> method
 * @param <String> dataType
 * @return {Promise}
 */

export const ajax = function (url, param, method = 'GET', dataType = 'json') {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: path,
      method: method,
      data: param,
      dataType: dataType,
      timeout: 4000,
      cache: false
    }).done(function (result) {
      if (result.success) {
        resolve(result.data)
      } else {
        reject(result.message, result)
      }
    }).fail(function () {
      reject('网络异常，请稍后再试!')
    })
  })
}
