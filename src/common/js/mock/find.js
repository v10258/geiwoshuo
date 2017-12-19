var Mock = require('mockjs')
import { REMOTE } from '../ajax.js'

export default function () {
  Mock.mock(new RegExp(REMOTE.find.relatedQuestions), {
    'success': true,
    'code': 200,
    'message': '',
    'data|10': [{
      'id|+1': 1,
      'title|2-7': '兑换外币',

      'uid': 100,
      'nickname': '@cname',
      'avatar': "@image('50x50','#02adea')",
      'url': '@url',

      'parse': 1800,
      'body': '',
      'answerer': 300
    }]
  })
}
