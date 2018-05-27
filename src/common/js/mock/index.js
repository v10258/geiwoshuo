import Mock from 'mockjs'
import { REMOTE } from '../ajax.js'

export default function () {
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
        'downvotes|0-100': 99,
        'views|100-999': 1,
        'dynamic|50-200': 1
      }],
      count: 189
    }
  })

  Mock.mock(new RegExp(REMOTE.index.featuredAnswer), {
    'success': true,
    'code': 200,
    'message': '',
    'data|3': [{
      '_id|+1': 1,
      'title|2-6': '兑换外币',
      'answerId|+1': 1,
      'content_abstract': {
        'text|9-11': '回答正文',
        'thumbnail': "@image('96x60', '#FF6600')"
      }
    }]
  })

  Mock.mock(new RegExp(REMOTE.index.stat), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {
      'question|300-999': 1,
      'responseRate|30-99': 1
    }
  })
}
