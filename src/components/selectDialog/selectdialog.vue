<template>
  <transition name="dialog-fade">
    <div class="select-dialog-wrapper" v-show="show">
      <div class="dialog-main">
        <p class="txt">{{txt}}</p>
        <div class="btn-wrap">
          <div class="btn confirm-btn" @click="confirmClick">是的</div>
          <div class="btn cancel-btn" @click="cancelClick">否</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /**
   * 选择警告框组件
   *
   * @param {String} txt - 警告框的提示文字
   * @param {Boolean} show - 控制组件的显示或隐藏
   *
   *
   * @event cancel - 点击取消按钮的时候触发此事件
   * @event confirm - 点击确认按钮的时候触发此事件
   * */
  export default {
    props: {
      txt: {
        type: String
      },
      show: {
        type: Boolean
      }
    },
    methods: {
      cancelClick: function() {
        this.$emit('cancel');
      },
      confirmClick: function() {
        this.$emit('confirm');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .select-dialog-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0.7)
    z-index: 99
    &.dialog-fade-enter
      opacity: 0
    &.dialog-fade-enter-active
      transition: all .3s ease
    &.dialog-fade-enter-to
      opacity: 1
    &.dialog-fade-leave-to
      opacity: 0
    &.dialog-fade-leave-active
      transition: all .3s ease
    .dialog-main
      position: absolute
      top: 50%
      left: 50%
      width: 280px
      height: 180px
      margin-top: -90px
      margin-left: -140px
      border-radius: 5px
      background-color: rgba(255,255,255,0.7)
      .txt
        padding: 36px
        text-align: center
      .btn-wrap
        display: flex
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: 38px
        font-size: 0
        text-align: center
        border-top-1px(rgba(160,157,153,0.4))
        .btn
          flex: 1
          width: 50%
          height: 38px
          line-height: 38px
          font-size: 14px
          &.cancel-btn
            color: #3473bc
          &.confirm-btn
            color: crimson
            border-right: 1px solid rgba(160,157,153,0.8)
</style>
