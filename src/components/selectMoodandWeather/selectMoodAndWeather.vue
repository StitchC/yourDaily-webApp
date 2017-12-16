<template>
  <transition name="selector-fade">
    <div class="selector-wrapper" v-show="show" @click="hideSelector">
      <div class="select-item-wrap">
        <span v-for="(icon, index) in classList" :class="icon" class="selector-item" @click="itemSelected($event, index)"></span>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /**
   * selectMoodAndWeather 组件
   *
   * @param {Array} classList - 需要生成的图标类名
   * @param {Boolean} selectorToggleShow - 控制组件的显示或隐藏
   * @param {Number} selectType - 对应的选择类型
   *
   * @event selector-change - 选择心情或天气项成功时触发父组件事件
   * @event selector-show-change - 组件关闭的时候通知父组件将其隐藏
   *
   * 通过遍历对 select-item-wrap 元素中的每一个item 增加类名生成icon
   * 每一个icon 点击会触发父组件的监听事件 selector-change
   * 而触发事件将由 itemSelected 方法处理 它会将对应icon 的index 传递给父组件
   * 至于父组件对选择后的icon 处理请看父组件的 dailynotepad 的注释
   */

  export default {
    data: function() {
      return {
        show: this.selectorToggleShow
      };
    },
    props: {
      classList: {
        type: Array
      },
      selectorToggleShow: {
        type: Boolean,
        default: false
      },
      selectType: {
        type: Number
      }
    },
    watch: {
      selectorToggleShow: function(val) {
        this.show = val;
      }
    },
    methods: {
      hideSelector: function() {
        this.$emit('selector-show-change', !this.show);
      },
      itemSelected: function(event, index) {
        this.$emit('selector-change', index);
      }
    }
  };
</script>

<style lang="stylus">
  .selector-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0.2)
    &.selector-fade-enter
      opacity: 0
    &.selector-fade-enter-active
      transition: all .4s linear
    &.selector-fade-enter-to
      opacity: 1
    &.selector-fade-leave-to
      opacity: 0
    &.selector-fade-leave-active
      transition: all .4s linear
    .select-item-wrap
      position: absolute
      top: 50%
      left: 50%
      width: 160px
      height: 40px
      margin-top: -20px
      margin-left: -80px
      border-radius: 5px
      background-color: rgba(0,0,0,0.5);
      text-align: center
      .selector-item
        width: 30px
        height: 40px
        line-height: 40px
        padding: 0 5px
        font-size: 20px
        text-align: center
        color: #fff
</style>
