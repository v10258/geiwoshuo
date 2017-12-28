<template>

<div class="login">
  <div class="login-header">
    <a @click="switchType('login')" :class="{ active: type === 'login' }" data-type="login" href="javascript:;">登录</a>
    <a @click="switchType('regist')" :class="{ active: type === 'regist' }" data-type="regist" href="javascript:;">注册</a>
  </div>
  <div class="login-type">
    <form id="loginForm" :action="actionUrl" method="POST">
        <template v-if="type === 'login' && loginType === 2">
          <div class="-group">
            <input class="-control" id="account" type="text" name="account" autocomplete="off" placeholder="邮箱／手机号">
          </div>

          <div class="-group">
            <input id="password" type="password" name="password" autocomplete="off" placeholder="密码">
          </div>

          <div class="-group verification">
            <input class="-control" id="captcha" type="text" name="captcha" autocomplete="off" placeholder="验证码">
            <div class="-wrap">
              <img class="-captcha" alt="" src="data:image/gif;base64,R0lGODdheAAeAIQAAP///97e/93d/6mp/6en/6Gh/5WV/4mJ/4eH/4WF/4OD/319/3Z2/05O/0hI/zEx/y8v/wAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAeAAeAEAI/wABCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaJFiBEiAAAQoaNHACAjAAAQAYBJABEAAIgA4ACABwkARABAMwIAABEA6IxQAEAEBBEACB1KtKjRo0iTKl16NILTp1AjAIhAlSqAq1izZo3AlSsAABHChgUAIACACAAARADAtq3bt3Djyp1Lt67du3jz6t3Ld28EAAAiCB4sGEAEAIgjAFgMIIJjAJAhR4gAoHIEAJgjAAAQAYDnCBEAAIgQAYDp06hTq17NurXr16gjAAAQAYDt27YjAAAQIQKA3xEiABgeAYDx48cjAAAQAQCACNAjAAAQAYD169iza9/Ovbv37+DDi/8fT768+fPo06tfz769+/fw20eYT79+BAAR8uvX7wCAf4AABAqMULAgAAARFEYA0NDhQ4gRJU6kWNHiRQARAGyMAMDjR48RAACIAADAgAgRAACIAMBlhAgAIgAAEAHAzQgAAESIACACAAARIgAgWtToUaRJlS5l2hRpBAAAIkylGgEAgAgAtG7VGiECgAgRAEQgGwHA2QgRAESIAABABAAAIhCIAMDuXbx59e7l29fv370RAAwGEMHwYQARACyOAMDxY8iQIwAAEAHA5QgAAESIAABABAChI0QAUNr0adSpVa9m3dr1a9ixZc+mXdv2bdy5de/m3dv3b+DBhQ8nXtz/+HHkyZWvjgDA+fPnEQBEAFDdevUI2QFs5x7Bu3cAACKMHw/APIAI6dUDYN/e/Xv48eXPp1+ffQQA+SMAABDBP8AIACJEAAAgAsIIABZGiADg4cMIACZGAGAxAgAAEQAAaBABAIAIEQCQLGnyJMqUKleybGkyAoCYEQDQrEkzAgAAEQDwBBABAIAIAABEiAAgQgQAACJEAAAgAoCoESIAABABgAAAWrdy7er1K9iwYsd2jRABANq0ACJEAAAgAgAAEebOBQAgQgQAESIAiAAgAoDAEQAAiADgMAMAACIAiADgMeTIkidTrmz5MmbKEQAAiADgM+jPEQAAiGD6NIDUwQAiAAAQ4XUEAAAiRAAQIQKA3BEALAAQwQCA4MKHEy9u/Djy5MqLRwAAIAL06NABRABgPQKA7NqzR+juPQIAABHGA4gAAECECAAgRAAQQUEEAPLn069v/z7+/Pr3048AACAAgQMFRgAQAUDCCAAYNnToMAIAABEiAAAQAUDGCAA4RogAAEAEACNJljR5EmVKlStZtnTZMkIEAAAi1KwJACeACDt5AvD5E2hQoUOJFjV6FGlSpUuZNnX6FGpUqVMBBAQAOw==">
              <span class="-tips">看不清楚？换一张</span>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="-group">
            <input class="-control" id="account" type="text" name="account" autocomplete="off" placeholder="手机号">
          </div>
          <div class="-group verification">
            <input class="-control" id="captcha" type="text" name="captcha" autocomplete="off" placeholder="验证码">
            <div class="-wrap">
              <img class="-captcha" alt="" src="data:image/gif;base64,R0lGODdheAAeAIQAAP///97e/93d/6mp/6en/6Gh/5WV/4mJ/4eH/4WF/4OD/319/3Z2/05O/0hI/zEx/y8v/wAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAeAAeAEAI/wABCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaJFiBEiAAAQoaNHACAjAAAQAYBJABEAAIgA4ACABwkARABAMwIAABEA6IxQAEAEBBEACB1KtKjRo0iTKl16NILTp1AjAIhAlSqAq1izZo3AlSsAABHChgUAIACACAAARADAtq3bt3Djyp1Lt67du3jz6t3Ld28EAAAiCB4sGEAEAIgjAFgMIIJjAJAhR4gAoHIEAJgjAAAQAYDnCBEAAIgQAYDp06hTq17NurXr16gjAAAQAYDt27YjAAAQIQKA3xEiABgeAYDx48cjAAAQAQCACNAjAAAQAYD169iza9/Ovbv37+DDi/8fT768+fPo06tfz769+/fw20eYT79+BAAR8uvX7wCAf4AABAqMULAgAAARFEYA0NDhQ4gRJU6kWNHiRQARAGyMAMDjR48RAACIAADAgAgRAACIAMBlhAgAIgAAEAHAzQgAAESIACACAAARIgAgWtToUaRJlS5l2hRpBAAAIkylGgEAgAgAtG7VGiECgAgRAEQgGwHA2QgRAESIAABABAAAIhCIAMDuXbx59e7l29fv370RAAwGEMHwYQARACyOAMDxY8iQIwAAEAHA5QgAAESIAABABAChI0QAUNr0adSpVa9m3dr1a9ixZc+mXdv2bdy5de/m3dv3b+DBhQ8nXtz/+HHkyZWvjgDA+fPnEQBEAFDdevUI2QFs5x7Bu3cAACKMHw/APIAI6dUDYN/e/Xv48eXPp1+ffQQA+SMAABDBP8AIACJEAAAgAsIIABZGiADg4cMIACZGAGAxAgAAEQAAaBABAIAIEQCQLGnyJMqUKleybGkyAoCYEQDQrEkzAgAAEQDwBBABAIAIAABEiAAgQgQAACJEAAAgAoCoESIAABABgAAAWrdy7er1K9iwYsd2jRABANq0ACJEAAAgAgAAEebOBQAgQgQAESIAiAAgAoDAEQAAiADgMAMAACIAiADgMeTIkidTrmz5MmbKEQAAiADgM+jPEQAAiGD6NIDUwQAiAAAQ4XUEAAAiRAAQIQKA3BEALAAQwQCA4MKHEy9u/Djy5MqLRwAAIAL06NABRABgPQKA7NqzR+juPQIAABHGA4gAAECECAAgRAAQQUEEAPLn069v/z7+/Pr3048AACAAgQMFRgAQAUDCCAAYNnToMAIAABEiAAAQAUDGCAA4RogAAEAEACNJljR5EmVKlStZtnTZMkIEAAAi1KwJACeACDt5AvD5E2hQoUOJFjV6FGlSpUuZNnX6FGpUqVMBBAQAOw==">
              <span class="-tips">看不清楚？换一张</span>
            </div>
          </div>
          <div class="-group phone-code">
              <input class="-control" id="code" type="text" name="code" autocomplete="off" placeholder="手机验证码">
              <span class="code-btn">获取验证码</span>
          </div>
        </template>

        <div class="agreement">
            <input id="agreement" class="-cbox" type="checkbox" name="agreement" checked="checked">
            <label for="agreement">我已阅读并同意<a href="javascript:;" target="_blank">用户协议和隐私条款</a></label>
            <a class="-forget" v-if="type === 'login' && loginType === 2" target="_blank" href="#">忘记密码</a>
        </div>
        <input type="button" name="submitBtn" class="action-btn" @click="signSubmit" v-bind:value="submitText">
    </form>
  </div>
  <div class="login-toggle"> 
    <span v-if="type==='login'" @click="switchLoginType" >{{loginTypeText}}</span>
  </div>
  <div class="sns-login">
      <a class="weixin" data-pid="weixin"> <span>微信</span> </a>
      <a class="qq" data-pid="qzone"> <span>QQ</span> </a>
  </div>
</div>

</template>

<script>

import { mapState } from 'vuex'
import { REMOTE, ajax } from '../../common/js/ajax.js'

export default {

  computed: {
    ...mapState([
      'type',
      'loginType',
      'resultData'
    ]),
    submitText() {
      return this.$store.state.type === 'login' ? '登录' : '注册'
    },
    actionUrl() {
      return this.$store.state.type === 'login' ? REMOTE.user.login : REMOTE.user.regist;
    },
    loginTypeText() {
      var text = '';
      if (this.$store.state.loginType === 1) {
        text = '账号密码登录';
      } else if(this.$store.state.loginType === 2) {
        text = '手机验证码登录';
      }
      return text;
    }
  },

  methods: {
    switchType(type){
      this.$store.commit('set', {
        type: type
      });
    },

    switchLoginType(){
      this.$store.commit('set', {
        loginType: this.loginType === 1 ? 2 : 1 
      });
    },

    postMessage(data) {
      data.key = 'login';
      window.name = 'login';
      window.opener && window.opener.postMessage(data, '/');
    },

    signSubmit(ev) {
      let self = this;
      let formEle = document.querySelector('#loginForm');
      let formData = this.$store.state.type === 'login' &&  this.$store.state.loginType === 2 ? {
        account: formEle.account.value,
        password: formEle.password.value,
        captcha: formEle.captcha.value
      } : {
        account: formEle.account.value,
        captcha: formEle.captcha.value,
        code: formEle.code.value
      };

      console.log('ev', ev);

      if (window.parent) {
        formData.dataType = 'json';
        ajax(self.actionUrl, formData, 'post')
          .then(function(data){
            self.postMessage(data);
            window.close();
          })
        ev.preventDefault();
      } else {
        formEle.submit();
      }
    }
  }
};
</script>
