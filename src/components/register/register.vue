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
      <alert-dialog :dialog-show.sync="dialogShowStatus" :txt="dialogTxt" @dialog-show-change="listenDialogStatus"></alert-dialog>
    <loading :show="loadingShow"></loading>
    </div>
</template>

<script type="text/ecmascript-6">
  import indexPage from 'components/indexPage/indexPage.vue';
  import dialog from 'base/alertDialog/alertdialog.vue';
  import loading from 'base/loading/loading.vue';
  import {SUCCESS_CODE, ERROR_CODE} from 'api/statusCode';
  import {netWorkError} from 'common/js/dialog.js';
  import {register} from 'api/allApi';


  export default {
    data: function() {
      return {
        loadingShow: false,
        dialogShowStatus: false,
        dialogTxt: '',
        accountVal: '',
        pwdVal: ''
      };
    },
    created() {
      this.registerStatus = 0; // 注册状态 0: 还没注册或注册失败  1: 注册成功
    },
    components: {
      'index-page': indexPage,
      'alert-dialog': dialog,
      loading
    },
    methods: {
      toLogin() {
        this.$router.push('/login');
      },
      toFindPwd() {
        this.$router.push('/findpwd');
      },
      listenDialogStatus() {
        this.dialogShowStatus = false;
        if(this.registerStatus === 1) {
          this.$router.push('/login');
        }
      },
      _toggleDialog(txt = '') {
        this.dialogShowStatus = !this.dialogShowStatus;
        this.dialogTxt = txt;
      },
      _registerSuccess() {
        this.loadingShow = false;
        this.accountVal = '';
        this.pwdVal = '';
        this.registerStatus = 1;
      },
      _registerError() {
        this.loadingShow = false;
        this.pwdVal = '';
        this.registerStatus = 0;
      },
      register() {
        let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if(this.accountVal === '' || this.pwdVal === '') {
          this._toggleDialog('注册的邮箱或密码不能为空哦');
          return;
        }
        if(!reg.test(this.accountVal)) {
          this._toggleDialog('请填写正确的邮箱地址哦');
          return;
        }else if(reg.test(this.accountVal) && this.pwdVal !== '') {
          if(this.pwdVal.length >= 16) {
            this._toggleDialog('你的密码太长了哦最多只能输入16位英文，数字或特殊字符');
            this.pwdVal = '';
          }else {
            register({
              account: this.accountVal,
              pwd: this.pwdVal
            }).then(res => {
              let data = res.data;

              if(data.status === SUCCESS_CODE) {
                this._toggleDialog('注册成功啦');
                this._registerSuccess();
              }else if(data.status === ERROR_CODE) {
                this._toggleDialog('啊哦，这个账号貌似已被人注册了');
                this._registerError();
              }
            }).catch(() => {
              this._registerError();
              this._toggleDialog(netWorkError);
            });
          }
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/theme.styl"

  .register-wrapper
    position: fixed
    width: 100%
    height: 100%
    bottom: 0
    left: 0
    .title
      margin-top: 5px
      font-size: $font-size-large-X
      color: #fff
      span
        margin: 0 6px
    .input-group
      position: fixed
      bottom: 172px
      width: 100%
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
      bottom: 30px
      width: 100%
      text-align: center
      transition: all .3s linear
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



  @media screen and (max-height: 450px)
    .register-wrapper
      .input-group
        bottom: 25%
      .btn-group
        display: none
        opacity: 0
</style>
