<template>
  <transition name="modify-input-slide">
    <div class="modify-input-wrap" v-show="show">
      <div class="input-header" :class="{'male-theme': initData.userSex === 1, 'female-theme': initData.userSex === 0}">
        <span class="close-btn icon-close" @click="close"></span>
        <h3 class="title">{{initData.title}}</h3>
        <span class="save-btn">{{btnTxt}}</span>
      </div>
      <div class="input-main" :class="{'male-theme': initData.userSex === 1, 'female-theme': initData.userSex === 0}">
        <input type="text" class="content-input" v-model="modifyContent">
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data: function() {
      return {
        show: this.inputShow,
        modifyContent: this.initData.content,
        btnTxt: '保存'
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
    methods: {
      close: function() {
        this.$emit('input-close');
      }
    },
    watch: {
      inputShow: function(val) {
        this.show = val;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
        background-color: #4889B4
      &.female-theme
        background-color: #FE706F
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
      width: 100%
      height: 50px
      margin-top: 100px
      background-color: #fff
      &.male-theme
        border-bottom: 2px solid #4889B4
      &.female-theme
        border-bottom: 2px solid #FE706F
      .content-input
        width: 100%
        height: 50px
        line-height: 50px
        padding-left: 5px
        &:focus
          outline: none
</style>
