<template>
  <div class="register-wrapper">
    <index-page>
      <p slot="page-title" class="title">你的日记<span>·</span>注册</p>
      <div slot="input-group" class="input-group">
        <div class="input-wrap border-1px">
          <input type="text" placeholder="请输入你的邮箱">
        </div>
        <div class="input-wrap border-1px">
          <input type="password" placeholder="请留下一个密码">
        </div>
      </div>
      <div class="btn-group" slot="btn-group">
        <div class="register-btn">注册</div>
        <span class="login-link" @click="toLogin">已有账号？去登陆</span>
        <span class="find-pwd-link" @click="toFindPwd">登陆遇到困难？去找回密码</span>
      </div>
    </index-page>
  </div>
</template>

<script type="text/ecmascript-6">
  import router from '../../router/index.js';
  import indexPage from 'components/indexPage/indexPage.vue';

  export default {
    data: function() {
      return {};
    },
    router: router,
    components: {
      'index-page': indexPage
    },
    methods: {
      toLogin: function() {
        this.$router.push('/login');
      },
      toFindPwd: function() {
        this.$router.push('/findpwd');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .register-wrapper
    position: fixed
    width: 100%
    height: 100%
    bottom: 0
    left: 0
    .title
      margin-top: 15px
      font-size: 24px
      color: #fff
      span
        margin: 0 6px
    .input-group
      width: 80%
      margin: 35% auto 0 auto
      .input-wrap
        margin-top: 10px
        border-1px(rgba(255,255,255,1))
        input
          width: 100%
          height: 45px
          line-height: 45px
          &::-webkit-input-placeholder
            color: rgba(255,255,255,0.8)
    .btn-group
      width: 80%
      margin: 35px auto 0 auto
      text-align: center
      .register-btn
        width: 100%
        height: 40px
        line-height: 40px
        border-radius: 5px
        background-color: #549DCD
        color: #fff
        font-size: 18px
      .login-link,
      .find-pwd-link
        display: inline-block
        margin-top: 15px
        color: #fff
</style>
