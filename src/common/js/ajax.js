const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';


export const REMOTE = {
  index: {
    queryQuestions: '/post/query'
  },
  task: {
    taskFollows: '/post/subscribe',
    doFollow: '/post/follows',
    queryAnswers: '/post/answers',
    queryAnswerCount: '/post/answerCount',
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
 * @param <Object> params
 * @param <String> method
 * @param <String> dataType
 * @return {Promise}
 */

export const ajax = function (url, params, method = 'get') {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: method,
      params: params,
      timeout: 3000
    })
    .then(function(res) {
      console.log(`url:${url}   res:`, res)
      if (res.data.success) {
        resolve(res.data.data, res.data)
      } else {
        reject(res.data.message, res.data);
      }
    },function(){
      reject('网络异常，请稍后再试!');
    }).catch(function(error){
      reject('网络异常，请稍后再试!');
      alert('网络异常，请稍后再试!');
    })
  })
}
