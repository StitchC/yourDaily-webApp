<template>
  <div class="login-wrapper">
      <index-page>
        <p slot="page-title" class="title">你的日记</p>
        <div slot="input-group" class="input-group">
          <div class="input-wrap border-1px">
            <input type="text" placeholder="邮箱" v-model="accountVal">
          </div>
          <div class="input-wrap border-1px">
            <input type="password" placeholder="密码" v-model="pwdVal">
          </div>
        </div>
        <div class="btn-group" slot="btn-group">
          <div class="login-btn" @click="login">登陆</div>
          <span class="register-link" @click="toRegister">没有账号？去注册</span>
        </div>
      </index-page>
      <alert-dialog :dialog-show="dialogShowStatus" :txt="dialogTxt" @dialog-show-change="listenDialogStatus"></alert-dialog>
    <loading :show="loadingShow"></loading>
    </div>
</template>

<script type="text/ecmascript-6">
  import indexPage from 'components/indexPage/indexPage.vue';
  import dialog from 'base/alertDialog/alertdialog.vue';
  import loading from 'base/loading/loading.vue';
  import {setLocalstorage, baseDataKey} from 'common/js/localStorage.js';
  import {SUCCESS_CODE, ERROR_CODE} from 'api/statusCode.js';
  import {netWorkError} from 'common/js/dialog.js';


  export default {
    data() {
      return {
        loadingShow: false,
        dialogShowStatus: false,
        dialogTxt: '',
        accountVal: '',
        pwdVal: ''
      };
    },
    methods: {
      toRegister() {
        this.$router.push('/register');
      },
      _setDialog(options) {
        // 设置提示框的显示和内容
        this.dialogTxt = options.dialogTxt;
        this.dialogShowStatus = options.showStatus;
      },
      login() {
        if(this.accountVal === '' || this.pwdVal === '') {
          this._setDialog({
            showStatus: true,
            dialogTxt: '账号或密码不能为空哦'
          });
        }else {
          this.$http.get('/yourdaily/php/login/check.php', {
            params: {
              account: this.accountVal,
              pwd: this.pwdVal
            },
            before: function() {
              this.loadingShow = true;
            }
          }).then(res => {
            let data = res.body;
            if(data.status === ERROR_CODE) {
              this.loadingShow = false;
              this._setDialog({
                showStatus: true,
                dialogTxt: '你的账号或密码有错误哦'
              });
            }else if(data.status === SUCCESS_CODE) {
              this.loadingShow = false;
              // 在localstorage 中保存用户的数据
              setLocalstorage(baseDataKey, res.body.info);
              this.$router.push('/user');
            }
          }).catch(() => {
            this.loadingShow = false;
            this._setDialog({
              showStatus: true,
              dialogTxt: netWorkError
            });
          });
        }
      },
      listenDialogStatus() {
        this.dialogShowStatus = false;
      }
    },
    components: {
      'index-page': indexPage,
      'alert-dialog': dialog,
      'loading': loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
   @import "../../common/stylus/mixin.styl"
   @import "../../common/stylus/theme.styl"

  .login-wrapper
    position: fixed
    width: 100%
    height: 100%
    top: 0
    left: 0
    .title
      font-size: $font-size-large-X
      color: #fff
    .input-group
      position: fixed
      top: 60%
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
      top: 80%
      width: 100%
      text-align: center
      .login-btn
        width: 80%
        height: 40px
        line-height: 40px
        margin: 0 auto
        border-radius: 5px
        background-color: #549DCD
        color: #fff
        font-size: $font-size-large
      .register-link
        display: inline-block
        margin-top: 15px
        color: #fff

  @media screen and (max-height: 450px)
    .login-wrapper
      .input-group
        top: 30%
</style>
