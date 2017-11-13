var Mock = require('mockjs')
import { REMOTE } from '../ajax.js'

Mock.mock(new RegExp(REMOTE.index.queryQuestions), {
  'success': true,
  'code': 200,
  'message': '',
  'data': {
    'list|20': [{
      'id|+1': 1,
      'title|2-7': '兑换外币',
      'body|5 - 20': '详细描述',
      'tags|2-5': [{
        'name|1': ['换汇', '代购', '投票', '陪玩'],
        'id|+1': 1
      }],
      'last_modified': "@datetime('yyyy-MM-dd HH:mm')",
      'upvotes|0-100': 1,
      'views|100-999': 1,
      'dynamic|50-200': 1
    }]
  }
})

Mock.mock(new RegExp(REMOTE.task.taskFollows), {
  'success': true,
  'code': 200,
  'message': '',
  'data|2-20': [{
    'uid|+1': 1,
    'nickname': '@cname',
    'avatar': "@image('200x100', '#FF6600')",
    'url': '@url'
  }]
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

Mock.mock(new RegExp(REMOTE.ask.autoComplete), {
  'success': true,
  'code': 200,
  'message': '',
  'data|2-10': [{
    "name|+1": [
      "标签a",
      "标签b",
      "标签c",
      "标签d",
      "标签e",
      "标签f",
      "标签g",
      "标签h",
      "标签i",
      "标签j"
    ],
    "tid|+1": 1
  }]
})
