var Mock = require('mockjs')
import { REMOTE } from '../ajax.js'

export default function () {
  Mock.mock(new RegExp(REMOTE.task.taskFollows), {
    'success': true,
    'code': 200,
    'message': '',
    'data|2-20': {
      'count': 9,
      'users': [{
        'uid|+1': 1,
        'nickname': '@cname',
        'avatar': "@image('200x100', '#FF6600')",
        'url': '@url'
      }]
    }
  })

  Mock.mock(new RegExp(REMOTE.task.doFollow), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {
      'uid': 100,
      'nickname': '@cname',
      'avatar': "@image('50x50','#02adea')",
      'url': '@url'
    }
  })
}