var Mock = require('mockjs')
import { REMOTE } from '../ajax.js'

export default function () {
  Mock.mock(new RegExp(REMOTE.task.taskFollows), {
    'success': true,
    'code': 200,
    'message': '',
    'data|2-20': [
      {
        'uid|+1': 1,
        'nickname': '@cname',
        'avatar': "@image('200x100', '#FF6600')",
        'url': '@url'
      }
    ]
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

  Mock.mock(new RegExp(REMOTE.task.queryAnswers), {
    'success': true,
    'code': 200,
    'message': '',
    'data|10': [{
      'body': '',
      'date': ''
    }]
  })

  Mock.mock(new RegExp(REMOTE.task.queryAnswerCount), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {
      'answerNum|100-200': 1,
      'actorNum|10-20': 1
    }
  })

  Mock.mock(new RegExp(REMOTE.task.op), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {}
  })

  Mock.mock(new RegExp(REMOTE.task.comment), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {
      'name': '尤慕',
      'uid': '24cd6162636131633563662559e',
      'avatar': 'https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D450%2C600/sign=21612f75580fd9f9a0425d6d101df81c/f703738da977391279828568f1198618367ae217.jpg',
      'signature': '我愿变成童话拟，里爱的辣个天使',
      'body': '我是楼主',
      'upvotes': 100,
      'downvotes': 20
    }
  })
}