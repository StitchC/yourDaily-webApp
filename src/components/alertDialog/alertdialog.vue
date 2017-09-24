<template>
  <transition name="dialog-fade">
    <div class="dialog-wrapper" v-show="show">
      <div class="dialog-main">
        <p class="txt">{{txt}}</p>
        <div class="btn" @click="hide">好的</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /*
    参数：
    txt: 警告框提示内容
    dialogShow: 父组件传递给子组件 控制子组件是否显示
    子组件内部的局部变量 show 接收dialogShow 父组件的值
    点击子组件 class="btn" 的按钮会更改局部变量 show 的值
    show 值的改变会触发父组件的 "dialog-show-change" 事件
   */
  export default {
    data: function() {
      return {
        show: this.dialogShow
      };
    },
    props: {
      txt: {
        type: String,
        default: ''
      },
      dialogShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      hide: function() {
        this.$emit('dialog-show-change', !this.show);
      }
    },
    watch: {
      dialogShow: function(val) {
        this.show = val;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .dialog-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0.4)
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
      .btn
        position: absolute
        bottom: 0
        left: 0
        width: 100%
        height: 38px
        line-height: 38px
        text-align: center
        color: crimson
        border-top-1px(rgba(160,157,153,0.4))
</style>
