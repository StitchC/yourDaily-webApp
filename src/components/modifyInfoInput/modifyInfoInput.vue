<template>
  <transition name="modify-input-slide">
    <div class="modify-input-wrap" v-show="show">
      <div class="input-header" :class="{'male-theme': initData.userSex === 1, 'female-theme': initData.userSex === 0}">
        <span class="close-btn icon-close" @click="close"></span>
        <h3 class="title">{{initData.title}}</h3>
        <span class="save-btn" @click="saveClick">{{btnTxt}}</span>
      </div>
      <div class="input-main" :class="{'male-theme': initData.userSex === 1, 'female-theme': initData.userSex === 0}">
        <input type="text" class="content-input" v-model="modifyContent">
        <span class="limit">{{resetLimit}}</span>
      </div>
      <alert-dialog :dialog-show.sync="alertDialogShow" :txt="dialogTxt"></alert-dialog>
      <loading :show="loadingShow"></loading>
      <hint-dialog :show="hintDialogShow" :hint-txt="hintTxt" :delay="hintDialogDelay" @will-hide="hintDialogWillHide"></hint-dialog>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /**
   *  修改个人信息组件
   *  @param {Object} initData - 初始化修改个人资料组件的数据
   *  @param {Boolean} inputShow - 控制组件的显示或隐藏
   *
   *
   *  @event input-close - 关闭组件时触发父组件事件
   *
   * */


  import alertDialog from 'base/alertDialog/alertdialog.vue';
  import loading from 'base/loading/loading.vue';
  import hintDialog from 'base/hintDialog/hintDialog.vue';
  import {SUCCESS_CODE, ERROR_CODE} from 'api/statusCode.js';
  import {modifyUserName, modifyUserMotto} from 'api/allApi.js';
  import {mapActions} from 'vuex';


  const MODIFY_USERNAME_CODE = 0;
  const MODIFY_MOTTO_CODE = 1;
  export default {
    data() {
      return {
        modifyContent: this.initData.content,
        saveStatus: 0,
        limit: this.initData.limit,
        alertDialogShow: false,
        dialogTxt: '',
        loadingShow: false,
        hintDialogShow: false,
        hintTxt: '',
        hintDialogDelay: 800
      };
    },
    props: {
      initData: {
        type: Object
      },
      show: {
        type: Boolean
      }
    },
    components: {
      'alert-dialog': alertDialog,
      loading,
      'hint-dialog': hintDialog
    },
    methods: {
      ...mapActions([
        'reloadUserInfo'
      ]),
      close() {
        this.$emit('update:show', false);
      },
      _toggleDialogShow(txt = '') {
        this.alertDialogShow = !this.alertDialogShow;
        this.dialogTxt = txt;
      },
      _toggleLoadingShow() {
        this.loadingShow = !this.loadingShow;
      },
      _toggleHintDialogShow(txt = '') {
        this.hintDialogShow = !this.hintDialogShow;
        this.hintTxt = txt;
      },
      _modifySuccess() {
        // 修改成功之后要做的事情
        this.saveStatus = 1;
        // 修改成功后 发送ajax 请求 更新vuex 数据
        this.reloadUserInfo({
          id: this.initData.userId
        }).then(() => {
          // 隐藏加载框
          this._toggleLoadingShow();
          // 显示提示框
          this._toggleHintDialogShow('修改成功');
        });
      },
      _modifyFailed() {
        // 隐藏加载组件
        this._toggleLoadingShow();
        this._toggleDialogShow('抱歉, 网络出了点小问题哦, 请稍候重试');
      },
      hintDialogWillHide(promise) {
        promise.then(() => {
          // 隐藏提示组件
          this._toggleHintDialogShow();
        });
      },
      saveClick() {
        if(this.saveStatus === 0) {
          if(this.initData.modifyType === MODIFY_USERNAME_CODE) {
            // 显示加载框
            this._toggleLoadingShow();

            modifyUserName({
              id: this.initData.userId,
              username: this.modifyContent
            }).then(res => {
              let data = res.data;
              if(data.status === SUCCESS_CODE) {
                this._modifySuccess();
              }else if(data.status === ERROR_CODE) {
                this._modifyFailed();
              }
            }).catch(() => {
              this._modifyFailed();
            });
          }else if(this.initData.modifyType === MODIFY_MOTTO_CODE) {
            // 显示加载框
            this._toggleLoadingShow();
            
            modifyUserMotto({
              id: this.initData.userId,
              motto: this.modifyContent
            }).then(res => {
              let data = res.data;
              if(data.status === SUCCESS_CODE) {
                this._modifySuccess();
              }else if(data.status === ERROR_CODE) {
                this._modifyFailed();
              }
            }).catch(() => {
              this._modifyFailed();
            });
          }
        }
      }
    },
    watch: {
      inputShow(val) {
        this.show = val;
      },
      initData(val) {
        this.limit = val.limit;
        this.modifyContent = val.content;
        this.saveStatus = 0;
      },
      modifyContent(val) {
        if(val.length >= this.limit) {
          this.modifyContent = val.slice(0, this.limit);
        }
      }
    },
    computed: {
      btnTxt() {
        return this.saveStatus === 0 ? '保存' : '已保存';
      },
      resetLimit() {
        if(this.modifyContent) {
          return this.limit - parseInt(this.modifyContent.length);
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

  .modify-input-wrap
    position: fixed
    width: 100%
    height: 100%
    top: 0
    left: 0
    background-color: #dedede
    &.modify-input-slide-enter
      transform: translate3d(100%,0,0)
    &.modify-input-slide-enter-active
      transition: all .5s ease
    &.modify-input-slide-enter-to
      transform: translate3d(0,0,0)
    &.modify-input-slide-leave-to
      transform: translate3d(100%,0,0)
    &.modify-input-slide-leave-active
      transition: all .5s ease
    .input-header
      position: relative
      width: 100%
      height: 100px
      line-height: 100px
      &.male-theme
        background-color: $male-color
      &.female-theme
        background-color: $female-color
      .close-btn
        position: absolute
        top: 36px
        left: 12px
        padding: 5px
        font-size: 18px
        color: #fff
      .save-btn
        position: absolute
        top: 35px
        right: 12px
        line-height: 30px
        font-size: 18px
        color: #fff
      .title
        color: #fff
        font-size: 18px
        text-align: center
    .input-main
      position: relative
      width: 100%
      height: 50px
      margin-top: 100px
      background-color: #fff
      &.male-theme
        border-bottom: 2px solid $male-color
      &.female-theme
        border-bottom: 2px solid $female-color
      .limit
        position: absolute
        top: 13px
        right:5px
        padding: 5px
        font-size: $font-size-middle
      .content-input
        width: 100%
        height: 50px
        line-height: 50px
        padding: 0 5px
        &:focus
          outline: none
</style>
