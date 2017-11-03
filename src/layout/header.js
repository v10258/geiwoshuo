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

$collect.citySwitch.on('click', (ev)=>{
  var $elem = $(ev.currentTarget);
  var $parent = $elem.parent();
  if($parent.hasClass('active')){
    $parent.removeClass('active');
  } else {
    $parent.addClass('active');
  }
});

$collect.cityList.on('click', 'a', (ev)=>{
  var $elem = $(ev.currentTarget);
  var sid = $elem.data('sid');
  pageEvent.$emit(pageEvent.header.citySwitch, {sid: sid});
  $elem.parents('.dropdown').removeClass('active');
});

pageEvent.$on(pageEvent.header.citySwitch, (data)=>{
  console.log('trigger ' + pageEvent.header.citySwitch, data);
})

console.log('header');

