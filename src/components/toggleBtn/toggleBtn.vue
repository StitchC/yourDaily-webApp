<template>
  <div class="btn-slider-wrapper">
    <div class="btn-slider" :class="{'slide-close': checked === false, 'slide-open': checked === true}">
      <div class="round-btn" :class="{'btn-close': checked === false, 'btn-open': checked === true}" @click="toggle" ref="btnHook"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /*
  *   开关按钮组件
  *   参数:
  *     checked:
  *     类型: Boolean
  *     描述: 控制开关按钮的 开/关状态
  *   事件:
  *     toggle-btn-change 触发父组件事件控制开关按钮的 关闭 / 打开 情况
  * */
  export default {
    props: {
      checked: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toggle: function() {
        this.$emit('toggle-btn-change');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .btn-slider-wrapper
    display: inline-block
    .btn-slider
      width: 45px
      height: 25px
      line-height: 25px
      margin-right: 5px
      border-radius: 15px
      padding: 0 3px
      &.slide-close
        background-color: #B1B1B1
      &.slide-open
        background-color:  #B0DFDA
      .round-btn
        display: inline-block
        vertical-align: text-top
        width: 20px
        height: 20px
        box-shadow: 0 2px 10px rgba(0,0,0,0.3)
        border-radius: 50%
        transition: all .3s linear
        &.btn-close
          margin-left: 0
          background-color: #EBEBEB
        &.btn-open
          margin-left: 25px
          background-color: #009383
</style>
