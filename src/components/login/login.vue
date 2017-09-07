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
    </div>
</template>

<script type="text/ecmascript-6">
  import router from '../../router/index.js';
  import indexPage from 'components/indexPage/indexPage.vue';
  import dialog from 'components/alertDialog/alertdialog.vue';
  import {setLocalStorage} from 'common/js/localStorage.js';


  const ERROR_CODE = 400;
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
    methods: {
      toRegister: function() {
        this.$router.push('/register');
      },
      login: function() {
        if(this.accountVal === '' || this.pwdVal === '') {
          this.dialogTxt = '账号或密码不能为空哦';
          this.dialogShowStatus = true;
        }else {
          this.$http.get('/yourdaily/php/login/check.php', {
            params: {
              account: this.accountVal,
              pwd: this.pwdVal
            }
          }).then(res => {
            let data = res.body;
            if(data.status === ERROR_CODE) {
              this.dialogTxt = '你的账号或密码有错误哦';
              this.dialogShowStatus = true;
            }else if(data.status === SUCCESS_CODE) {
              this.$router.push('/user');
              let locaStr = JSON.stringify(res.body.info);
              setLocalStorage(locaStr);
            }
          });
        }
      },
      listenDialogStatus: function(bool) {
        this.dialogShowStatus = bool;
      }
    },
    components: {
      'index-page': indexPage,
      'alert-dialog': dialog
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
   @import "../../common/stylus/mixin.styl"
  .login-wrapper
    position: fixed
    width: 100%
    height: 100%
    top: 0
    left: 0
    .title
      font-size: 24px
      color: #fff
    .input-group
      position: fixed
      top: 50%
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
        font-size: 18px
      .register-link
        display: inline-block
        margin-top: 15px
        color: #fff

   @media screen and (max-height: 300px)
    .input-group
      top: 10% !important
</style>
