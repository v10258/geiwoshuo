/*!
 * header.js
 * @date 2017.11.3
 * @version 0.0.1
 */

require('./header.scss');

var $ = require('jquery');
var pageEvent = require('../common/js/page-event.js');

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
  pageEvent.$emit(pageEvent.header.citySwitch, {sid: sid});
  $elem.parents('.dropdown').removeClass('active');
});

// 点击页面其他位置，关闭城市切换浮层
$(document).on('click', (ev)=>{
  if ($(ev.target).parents('.-city').length === 0) {
    $collect.citySwitch.parent().removeClass('active');
  }
});
pageEvent.$on(pageEvent.header.citySwitch, (data)=>{
  console.log('trigger ' + pageEvent.header.citySwitch, data);
})

console.log('header');

