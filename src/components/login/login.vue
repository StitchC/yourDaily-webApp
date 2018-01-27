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
      <alert-dialog :dialog-show.sync="dialogShowStatus" :txt="dialogTxt"></alert-dialog>
    <loading :show="loadingShow"></loading>
    </div>
</template>

<script type="text/ecmascript-6">
  import indexPage from 'components/indexPage/indexPage.vue';
  import dialog from 'base/alertDialog/alertdialog.vue';
  import loading from 'base/loading/loading.vue';
  import {SUCCESS_CODE, ERROR_CODE} from 'api/statusCode.js';
  import {netWorkError} from 'common/js/dialog.js';
  import {login, getAllData} from 'api/allApi.js';
  import {mapMutations} from 'vuex';


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
      ...mapMutations({
        saveDaily: 'UPDATE_DAILY',
        saveInfo: 'UPDATE_USER_INFO'
      }),
      toRegister() {
        this.$router.push('/register');
      },
      _toUser() {
        this.$router.push('/user');
      },
      _toggleLoadingShow() {
        this.loadingShow = !this.loadingShow;
      },
      _toggleDialog(txt = '') {
        this.dialogShowStatus = !this.dialogShowStatus;
        this.dialogTxt = txt;
      },
      login() {
        if(this.accountVal === '' || this.pwdVal === '') {
          this._toggleDialog('账号或密码不能为空哦');
        }else {
          this._toggleLoadingShow();
          login('/yourdaily/php/login/check.php', {
            account: this.accountVal,
            pwd: this.pwdVal
          }).then((res) => {
            if(res.data.status === SUCCESS_CODE) {
              // 登录成功
              // 发送请求获取用户数据
              getAllData('/yourdaily/php/user/getUserData.php', {
                id: res.data.info.id,
                connectId: res.data.info.connect
              }).then((res) => {
                // 设置vuex 数据
                this.saveDaily(res.data.daily);
                this.saveInfo(res.data.info);
                this._toggleLoadingShow();
                this._toUser();
              });
            }else if(res.data.status === ERROR_CODE) {
              // 登录错误
              this._toggleLoadingShow();
              this._toggleDialog('你的账号或密码有错误哦');
            }
          }).catch(() => {
            // 网络错误
            this._toggleLoadingShow();
            this._toggleDialog(netWorkError);
          });
        }
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
      bottom: 136px
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


  @media screen and (max-width: 320px)
    .login-wrapper
      .title
        font-size: $font-size-large-X
  @media screen and (max-height: 450px)
    .login-wrapper
      .input-group
        bottom: 25%
      .btn-group
        display: none
        opacity: 0
</style>
