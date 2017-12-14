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

  Mock.mock(new RegExp(REMOTE.task.doVote), {
    'success': true,
    'code': 200,
    'message': '',
    'data': null
  })

  Mock.mock(new RegExp(REMOTE.task.comment), {
    'success': true,
    'code': 200,
    'message': '',
    'data': null
  })
}