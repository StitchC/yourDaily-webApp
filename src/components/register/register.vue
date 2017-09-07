<template>
  <div class="register-wrapper">
      <index-page>
        <p slot="page-title" class="title">你的日记<span>·</span>注册</p>
        <div slot="input-group" class="input-group">
          <div class="input-wrap border-1px">
            <input type="text" placeholder="请输入你的邮箱" v-model="accountVal">
          </div>
          <div class="input-wrap border-1px">
            <input type="password" placeholder="请留下一个密码" v-model="pwdVal">
          </div>
        </div>
        <div class="btn-group" slot="btn-group">
          <div class="register-btn" @click="register">注册</div>
          <span class="login-link" @click="toLogin">已有账号？去登陆</span>
          <span class="find-pwd-link" @click="toFindPwd">登陆遇到困难？去找回密码</span>
        </div>
      </index-page>
      <alert-dialog :dialog-show="dialogShowStatus" :txt="dialogTxt" @dialog-show-change="listenDialogStatus"></alert-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  import router from '../../router/index.js';
  import indexPage from 'components/indexPage/indexPage.vue';
  import dialog from 'components/alertDialog/alertdialog.vue';

  const SUCCESS_CODE = 200;

  export default {
    data: function() {
      return {
        dialogShowStatus: false,
        dialogTxt: '',
        accountVal: '',
        pwdVal: ''
      };
    },
    router: router,
    components: {
      'index-page': indexPage,
      'alert-dialog': dialog
    },
    methods: {
      toLogin: function() {
        this.$router.push('/login');
      },
      toFindPwd: function() {
        this.$router.push('/findpwd');
      },
      listenDialogStatus: function(bool) {
        this.dialogShowStatus = bool;
        if(this.dialogTxt === '注册成功啦') {
          this.$router.push('/login');
        }
      },
      register: function() {
        let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if(this.accountVal === '' || this.pwdVal === '') {
          this.dialogShowStatus = true;
          this.dialogTxt = '注册的邮箱或密码不能为空哦';
        }
        if(!reg.test(this.accountVal)) {
          this.dialogShowStatus = true;
          this.dialogTxt = '请填写正确的邮箱地址哦';
        }else if(reg.test(this.accountVal) && this.pwdVal !== '') {
          if(this.pwdVal.length >= 16) {
            this.dialogShowStatus = true;
            this.dialogTxt = '你的密码太长了哦最多只能输入16位英文，数字或特殊字符';
            this.pwdVal = '';
          }else {
            this.$http.post('/yourdaily/php/register/check.php', {
              account: this.accountVal,
              pwd: this.pwdVal
            }, {emulateJSON: true}).then(res => {
              let data = res.body;
              console.log(data);

              if(data.status === SUCCESS_CODE) {
                this.dialogShowStatus = true;
                this.dialogTxt = '注册成功啦';
                this.accountVal = '';
                this.pwdVal = '';
              }else {
                this.dialogShowStatus = true;
                this.dialogTxt = '啊哦，这个账号貌似已被人注册了';
                this.pwdVal = '';
              }
            });
          }
        }
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
      margin-top: 5px
      font-size: 24px
      color: #fff
      span
        margin: 0 6px
    .input-group
      position: fixed
      top: 40%
      width: 100%
      margin: 15% auto 0 auto
      transition: all .3s linear
      .input-wrap
        width: 80%
        margin: 0 auto
        border-bottom-1px(rgba(255,255,255,1))
        &:last-child
          margin-top: 10px
        input
          width: 100%
          height: 45px
          line-height: 45px
          &::-webkit-input-placeholder
            color: rgba(255,255,255,0.8)
    .btn-group
      position: fixed
      top: 75%
      width: 100%
      text-align: center
      .register-btn
        width: 80%
        height: 40px
        line-height: 40px
        margin: 0 auto
        border-radius: 5px
        background-color: #549DCD
        color: #fff
        font-size: 18px
      .login-link,
      .find-pwd-link
        display: block
        margin-top: 15px
        color: #fff

  @media screen and (max-height: 300px)
    .register-wrapper
      .input-group
        top: 5% !important
</style>
