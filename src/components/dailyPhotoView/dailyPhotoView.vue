<template>
  <transition name="photo-view-fade">
    <div class="photo-view-wrapper" v-show="show">
      <img :src="photoUrl" @click="closeView">
      <div class="delete-btn icon-delete" @click="drop"></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /**
   * 日记图片预览组件
   * 参数：
   * show: 控制组件的显示或隐藏
   * photoUrl: 接收图片的url 路径显示图片
   * photoIndex: 删除图片时通知父组件删除数组对应索引的内容
   *
   * 事件：
   * close: 关闭预览组件
   * deletePhoto: 删除图片时触发，通知父组件删除对应的图片
   * */
  export default {
    props: {
      show: {
        type: Boolean
      },
      photoUrl: {
        type: String
      },
      photoIndex: {
        type: Number
      }
    },
    methods: {
      closeView: function() {
        this.$emit('close');
      },
      drop: function() {
        this.$emit('delete-photo', this.photoIndex);
      }
    }
  };
</script>

<style lang="stylus">
  .photo-view-wrapper
    position: fixed
    top: 0
    left: 0
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0.5)
    z-index: 55
    &.photo-view-fade-enter
      opacity: 0
    &.photo-view-fade-enter-to
      opacity: 1
    &.photo-view-fade-enter-active
      transition: all .5s ease
    &.photo-view-fade-leave-to
      opacity: 0
    &.photo-view-fade-leave-active
      transition: all .5s ease
    .delete-btn
      position: fixed
      right: 20px
      bottom: 50px
      width: 40px
      height: 40px
      line-height: 40px
      text-align: center
      color: #e41c21
      font-size: 18px
      background-color: #fff
      border-radius: 5px
    img
      display: block
      width: 90%
</style>
