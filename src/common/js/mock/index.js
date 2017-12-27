var Mock = require('mockjs')
import { REMOTE } from '../ajax.js'

export default function() {
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
}




