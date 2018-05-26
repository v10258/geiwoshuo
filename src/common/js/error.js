
import swal from 'sweetalert'

const errorMap = {
  ask: {

  },
  index: {
  },
  global: {
    '401': '请先登录！'
  }
}

const errorHandler = function (err, pageId = 'global') {
  if (!err || !err.code) return
  let message

  console.log('errorHandler', err, pageId)

  if (errorMap[pageId] && errorMap[pageId][err.code]) {
    message = errorMap[pageId][err.code]
  } else if (errorMap.global[err.code]) {
    message = errorMap.global[err.code]
  } else {
    message = err.message || '未知错误'
  }

  swal(message)
}

export default errorHandler
