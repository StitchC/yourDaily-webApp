<template>
  <div class="loading-wrap" v-show="show">
    <div class="loading-logo">
      <span class="loading-txt">请稍候</span>
      <div class="loading-icon-wrap">
        <img src="./loading.gif">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      show: {
        type: Boolean
      }
    }
  };
</script>

<style lang="stylus">
  @import "../../common/stylus/theme.styl"

  .loading-wrap
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0.3)
    z-index: 99
    .loading-logo
      position: absolute
      top: 50%
      left: 50%
      margin-top: -75px
      margin-left: -100px
      width: 200px
      height: 150px
      border-radius: 5px
      background-color: rgba(0,0,0,0.6)
      text-align: center
      color: #fff
      .loading-txt
        display: inline-block
        margin-top: 48px
        font-size: $font-size-middle
      img
        width: 50px
</style>
