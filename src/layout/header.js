/*!
 * header.js
 * @date 2017.11.3
 * @version 0.0.1
 */

import './header.scss'

import $ from 'jquery'

import EventBus from '../common/js/event-bus.js'

var $collect = {
  citySwitch: $('#J_citySwitch'),
  cityList: $('#J_citySwitch').next()
}

// 点击切换，显示城市选择菜单
$collect.citySwitch.on('click', (ev) => {
  var $elem = $(ev.currentTarget)
  var $parent = $elem.parent()
  if ($parent.hasClass('active')) {
    $parent.removeClass('active')
  } else {
    $parent.addClass('active')
  }
  ev.stopPropagation()
})

// 点选城市，传播事件
$collect.cityList.on('click', 'a', (ev) => {
  var $elem = $(ev.currentTarget)
  var sid = $elem.data('sid')
  EventBus.$emit(EventBus.header.citySwitch, {sid: sid})
  $elem.parents('.dropdown').removeClass('active')
})

// 点击页面其他位置，关闭城市切换浮层
$(document).on('click', (ev) => {
  if ($(ev.target).parents('.-city').length === 0) {
    $collect.citySwitch.parent().removeClass('active')
  }
})
EventBus.$on(EventBus.header.citySwitch, (data) => {
  console.log('trigger ' + EventBus.header.citySwitch, data)
})

// 监听登录页消息反馈
window.addEventListener('message', function (event) {
  console.log('message event', event)
  if (!event.source || !event.origin || !event.data) return

  switch (event.source.name) {
    case 'login': {
      if (window.__PAGE_PRE && window.__PAGE_PRE.notRefreshAfterLogin) {
        window.__PAGE_PRE.isUserLogin = true
        // todo 加载用户信息和消息
      } else {
        window.location.reload()
      }
      break
    }
    default: {}
  }
}, false)

console.log('header')
