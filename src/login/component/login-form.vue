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
            <div class="-wrap" @mouseover="isMouseover = true" @mouseleave="isMouseover = false">
              <img class="-captcha" @click="switchCaptcha" alt="" :src="captcha">
              <span class="-tips" v-show="isMouseover">看不清楚？换一张</span>
            </div>
          </div>
          <input type="hidden" name="captcha_id" v-model="captchaId">
        </template>

        <template v-else>
          <div class="-group">
            <input class="-control" id="account" type="text" name="account" autocomplete="off" placeholder="手机号">
          </div>
          <div class="-group verification">
            <input class="-control" id="captcha" type="text" name="captcha" autocomplete="off" placeholder="验证码">
            <div class="-wrap" @mouseover="isMouseover = true" @mouseleave="isMouseover = false">
              <img class="-captcha" @click="switchCaptcha" alt="" :src="captcha">
              <span class="-tips" v-show="isMouseover">看不清楚？换一张</span>
            </div>
          </div>
          <div class="-group phone-code">
              <input class="-control" id="code" type="text" name="code" autocomplete="off" placeholder="手机验证码">
              <span class="code-btn">获取验证码</span>
          </div>
          <input type="hidden" name="captcha_id" v-model="captchaId">
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
      'captcha',
      'captchaId'
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

  data () {
    return {
      isMouseover: false
    }
  },

  created () {
    this.$store.dispatch('getCaptcha');
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

    switchCaptcha() {
      this.$store.dispatch('getCaptcha')
    },

    postMessage(data) {
      // 添加窗口标识，发送信息给父页面
      window.name = 'login';
      window.opener && window.opener.postMessage(data, '/');
    },

    signSubmit(ev) {
      let self = this;
      let formEle = document.querySelector('#loginForm');
      let formData = this.$store.state.type === 'login' &&  this.$store.state.loginType === 2 ? {
        account: formEle.account.value,
        password: formEle.password.value,
        captcha: formEle.captcha.value,
        captcha_id: formEle.captcha_id.value
      } : {
        account: formEle.account.value,
        captcha: formEle.captcha.value,
        code: formEle.code.value,
        captcha_id: formEle.captcha_id.value
      };

      console.log('ev', ev);

      if (window.opener) {
        try {
          formData.dataType = 'json';
          ajax(self.actionUrl, formData, 'post')
            .then(function(data){
              self.postMessage(data);
              window.close();
            })
          ev.preventDefault();
        } catch (error) {
          location.href="/";
        }
      } else {
        formEle.submit();
      }
    }
  }
};
</script>
