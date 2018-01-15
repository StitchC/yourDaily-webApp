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
      <alert-dialog :dialog-show="alertDialogShow" :txt="dialogTxt" @dialog-show-change="alertDialogShowChange"></alert-dialog>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import alertDialog from 'base/alertDialog/alertdialog.vue';
  import {SUCCESS_CODE, ERROR_CODE} from 'api/statusCode.js';
  import {mapActions} from 'vuex';

  /**
   *  修改个人信息组件
   *  @param {Object} initData - 初始化修改个人资料组件的数据
   *  @param {Boolean} inputShow - 控制组件的显示或隐藏
   *
   *
   *  @event input-close - 关闭组件时触发父组件事件
   *
   * */


  const MODIFY_USERNAME_CODE = 0;
  const MODIFY_MOTTO_CODE = 1;
  export default {
    data() {
      return {
        show: this.inputShow,
        modifyContent: this.initData.content,
        btnTxt: '保存',
        limit: this.initData.limit,
        alertDialogShow: false,
        dialogTxt: ''
      };
    },
    props: {
      initData: {
        type: Object
      },
      inputShow: {
        type: Boolean
      }
    },
    components: {
      'alert-dialog': alertDialog
    },
    methods: {
      ...mapActions([
        'reloadData'
      ]),
      close() {
        this.$emit('input-close');
      },
      saveClick() {
        if(this.btnTxt === '保存') {
          if(this.initData.modifyType === MODIFY_USERNAME_CODE) {
            this.$http.post('/yourdaily/php/user/modifyUserName.php', {
              id: this.initData.userId,
              username: this.modifyContent
            }, {emulateJSON: true}).then(res => {
              let data = res.body;
              if(data.status === SUCCESS_CODE) {
                this.btnTxt = '已保存';
                // 修改成功后 发送ajax 请求 更新vuex 数据
                this.reloadData({
                  id: this.initData.userId,
                  connectId: this.initData.connect
                });
              }else if(data.status === ERROR_CODE) {
                this.alertDialogShow = true;
                this.dialogTxt = '抱歉，你的网络出了点小问题哦，请稍候重试';
              }
            });
          }else if(this.initData.modifyType === MODIFY_MOTTO_CODE) {
            this.$http.post('/yourdaily/php/user/modifyMotto.php', {
              id: this.initData.userId,
              motto: this.modifyContent
            }, {emulateJSON: true}).then(res => {
              let data = res.body;
              if(data.status === SUCCESS_CODE) {
                this.btnTxt = '已保存';
                // 修改成功后 发送ajax 请求 更新vuex 数据
                this.reloadData({
                  id: this.initData.userId,
                  connectId: this.initData.connect
                });
              }else if(data.status === ERROR_CODE) {
                this.alertDialogShow = true;
                this.dialogTxt = '抱歉，你的网络出了点小问题哦，请稍候重试';
              }
            });
          }
        }
      },
      alertDialogShowChange() {
        this.alertDialogShow = false;
      }
    },
    watch: {
      inputShow(val) {
        this.show = val;
      },
      initData(val) {
        this.limit = val.limit;
        this.modifyContent = val.content;
        this.btnTxt = '保存';
      },
      modifyContent(val) {
        if(val.length >= this.limit) {
          this.modifyContent = val.slice(0, this.limit);
        }
      }
    },
    computed: {
      resetLimit() {
        return this.limit - parseInt(this.modifyContent.length);
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
