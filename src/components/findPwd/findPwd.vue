<template>
  <div class="findpwd-wrapper">
      <index-page>
        <p slot="page-title" class="title">你的日记<span>·</span>找回密码</p>
        <div slot="input-group" class="input-group">
          <div class="input-wrap border-1px">
            <input type="text" placeholder="邮箱" v-model="email">
          </div>
        </div>
        <div class="btn-group" slot="btn-group">
          <div class="get-email-btn" @click="getEmail">获取[ 重置密码 ]邮件</div>
          <span class="login-link" @click="toLogin">又想起来了？去登陆</span>
        </div>
      </index-page>
      <alert-dialog :dialog-show.sync="dialogShowStatus" :txt="dialogTxt"></alert-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  import indexPage from 'components/indexPage/indexPage.vue';
  import dialog from 'base/alertDialog/alertdialog.vue';

  export default {
    data: function() {
      return {
        email: '',
        dialogShowStatus: false,
        dialogTxt: ''
      };
    },
    components: {
      'index-page': indexPage,
      'alert-dialog': dialog
    },
    methods: {
      _toggleDialog(txt = '') {
        this.dialogShowStatus = !this.dialogShowStatus;
        this.dialogTxt = txt;
      },
      _sendEmail({url, account}) {
        // 提交账号给后台 获取密码邮件
        return this.$http.post(url, {
          mail: account
        }, {
          emulateJSON: true
        });
      },
      toLogin() {
        this.$router.push('/login');
      },
      getEmail() {
        this._toggleDialog('抱歉, 邮件系统尚未完成');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/theme.styl"

  .findpwd-wrapper
    position: fixed
    width: 100%
    height: 100%
    bottom: 0
    left: 0
    &.findPwd-slide-enter
      transform: translate3d(100%,0,0)
    &.findPwd-slide-enter-active
      transition: all linear .4s
    &.findPwd-slide-enter-to
      transform: translate3d(0,0,0)
    &.findPwd-slide-leave
      transform: translate3d(-100%,0,0)
    &.findPwd-slide-leave-active
      transition: all linear .6s
    .title
      margin-top: 15px
      font-size: $font-size-large-X
      color: #fff
      span
        margin: 0 6px
    .input-group
      position: fixed
      bottom: 141px
      width: 100%
      transition: all .3s linear
      .input-wrap
        width: 80%
        margin: 0 auto
        border-bottom-1px(rgba(255,255,255,1))
        input
          width: 100%
          height: 45px
          line-height: 45px
          &::-webkit-input-placeholder
            color: rgba(255,255,255,0.8)
    .btn-group
      position: fixed
      bottom: 30px
      width: 100%
      text-align: center
      transition: all .3s linear
      .get-email-btn
        width: 80%
        height: 45px
        line-height: 45px
        margin: 0 auto
        border-radius: 5px
        background-color: #549DCD
        color: #fff
        font-size: $font-size-large
      .login-link
        display: inline-block
        margin-top: 15px
        color: #fff

  @media screen and (max-height: 450px)
    .findpwd-wrapper
      .input-group
        bottom: 25%
      .btn-group
        display: none
        opacity: 0
</style>
