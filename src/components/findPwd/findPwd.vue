<template>
  <div class="findpwd-wrapper">
    <index-page>
      <p slot="page-title" class="title">你的日记<span>·</span>找回密码</p>
      <div slot="input-group" class="input-group">
        <div class="input-wrap border-1px">
          <input type="text" placeholder="邮箱">
        </div>
      </div>
      <div class="btn-group" slot="btn-group">
        <div class="get-email-btn">获取[ 重置密码 ]邮件</div>
        <span class="login-link" @click="toLogin">又想起来了？去登陆</span>
      </div>
    </index-page>
  </div>
</template>

<script type="text/ecmascript-6">
  import router from '../../router/index.js';
  import indexPage from 'components/indexPage/indexPage.vue';

  export default {
    router: router,
    components: {
      'index-page': indexPage
    },
    methods: {
      toLogin: function() {
        this.$router.push('/login');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .findpwd-wrapper
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
      margin: 50% auto 0 auto
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
      .get-email-btn
        width: 100%
        height: 45px
        line-height: 45px
        border-radius: 5px
        background-color: #549DCD
        color: #fff
        font-size: 18px
      .login-link
        display: inline-block
        margin-top: 15px
        color: #fff
</style>
