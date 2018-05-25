import Mock from 'mockjs'
import { REMOTE } from '../ajax.js'

export default function () {
  Mock.mock(new RegExp(REMOTE.serve.captcha), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {
      'captcha': "@image('102x40', '#FF6600')",
      'captchaId| 1-7': '3a027b5'
    }
  })
}
