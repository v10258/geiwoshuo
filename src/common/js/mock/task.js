import Mock from 'mockjs'
import { REMOTE, remoteUrlCombine } from '../ajax.js'

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

  const queryAnswersUrl = remoteUrlCombine(REMOTE.task.queryAnswers, {
    post_id: '[a-z0-9]{24}'
  })
  Mock.mock(new RegExp(queryAnswersUrl), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {
      'answers|10': [{
        '_id': '5aeab132916d33bdb8bd6412',
        'creator': {
          '_id': '59f987f8a25b83ca4c228023',
          'name': '半夏',
          'signature|1-2': '哈哈哈',
          'avatar': "@image('60x60', '#FF6600')"
        },
        'created': '2018-05-03T06:50:26.840Z',
        'post_id': '5a2943e0de7366aae79feef9',
        'body': '<p>dododo~~~</p>',
        'downvotes|0-20': 0,
        'upvotes|10-100': 0
      }],
      'totalPages|5-10': 1,
      'answerCount|100-200': 1,
      'pageNum|+1': 2
    }
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

  const relatedUrl = remoteUrlCombine(REMOTE.task.related, {
    post_id: '[a-z0-9]{24}'
  })
  Mock.mock(new RegExp(relatedUrl), {
    'success': true,
    'code': 200,
    'message': '',
    'data|3': [{
      '_id|+1': 1,
      'title|3-6': '帮忙砍价',
      'answerNum|0-9999': 5
    }]
  })
}
