/*!
 * header.js
 * @date 2017.11.3
 * @version 0.0.1
 */

require('./header-user.scss');

var $ = require('jquery');
var EventBus = require('../common/js/event-bus.js');

var $collect = {
  citySwitch: $('#J_citySwitch'),
  cityList: $('#J_citySwitch').next()
}

// 点击切换，显示城市选择菜单
$collect.citySwitch.on('click', (ev)=>{
  var $elem = $(ev.currentTarget);
  var $parent = $elem.parent();
  if($parent.hasClass('active')){
    $parent.removeClass('active');
  } else {
    $parent.addClass('active');
  }
  ev.stopPropagation();
});

// 点选城市，传播事件
$collect.cityList.on('click', 'a', (ev)=>{
  var $elem = $(ev.currentTarget);
  var sid = $elem.data('sid');
  EventB.$emit(EventB.header.citySwitch, {sid: sid});
  $elem.parents('.dropdown').removeClass('active');
});

// 点击页面其他位置，关闭城市切换浮层
$(document).on('click', (ev)=>{
  if ($(ev.target).parents('.-city').length === 0) {
    $collect.citySwitch.parent().removeClass('active');
  }
});
EventB.$on(EventB.header.citySwitch, (data)=>{
  console.log('trigger ' + EventB.header.citySwitch, data);
})

console.log('header');

