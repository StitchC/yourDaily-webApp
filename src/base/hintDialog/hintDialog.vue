<template>
  <div class="hint-dialog-wrap" v-show="show">
    <div class="hint-logo">
      <div class="hint-icon-wrap">
        <img src="./ok.png">
      </div>
      <span class="hint-txt">{{hintTxt}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      show: {
        type: Boolean
      },
      hintTxt: {
        type: String
      },
      delay: {
        type: Number
      }
    },
    watch: {
      show(val) {
        if(val) {
          // 如果 show 的值为 true
          // 那么触发父组件事件 并且返回一个 promise 对象
          // 告知父组件什么时候隐藏
          const promise = new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, this.delay);
          });
          this.$emit('will-hide', promise);
        }
      }
    }
  };
</script>

<style lang="stylus">
  @import "../../common/stylus/theme.styl"

  .hint-dialog-wrap
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0.3)
    z-index: 99
    .hint-logo
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
      .hint-icon-wrap
        margin-top: 30px
      .hint-txt
        display: inline-block
        margin-top: 10px
        font-size: $font-size-middle
        color: #fff;
      img
        width: 50px
</style>
