var Mock = require('mockjs')
import { REMOTE } from '../ajax.js'

export default function () {
  Mock.mock(new RegExp(REMOTE.ask.autoComplete), {
    'success': true,
    'code': 200,
    'message': '',
    'data|2-10': [{
      'name|+1': [
        '标签a',
        '标签b',
        '标签c',
        '标签d',
        '标签e',
        '标签f',
        '标签g',
        '标签h',
        '标签i',
        '标签j'
      ],
      'tid|+1': 1
    }]
  })

  Mock.mock(new RegExp(REMOTE.ask.fileupload), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {
      'files': [{
        'url': 'http://img.hb.aicdn.com/3a027b59bde54fa6368a5a076f868382c0d48e4217ca9-qQMKkm_fw658',
        'name': '20161029104725217.jpg',
        'type': 'image/jpeg',
        'size': 103102
      }]
    }
  })

  Mock.mock(new RegExp(REMOTE.ask.add), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {
      'qid': '3a027b59bde54fa6368a5a076f',
      'url': '/post/3a027b59bde54fa6368a5a076f'
    }
  })
}


