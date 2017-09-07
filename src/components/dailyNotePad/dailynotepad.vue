<template>
  <transition name="notepad-slide">
    <div class="notepad-wrapper" v-show="show">
      <div class="notepad-header" :class="{'male-theme': userSex === 1, 'female-theme': userSex === 0}">
        <div class="close-btn icon-close" @click="closeNotepad"></div>
        <div class="date">2017-09-07</div>
        <div class="save-btn">保存</div>
      </div>
      <div class="notepad-main">
        <div class="title-input">
          <input type="text" placeholder="标题">
        </div>
        <div class="content-input">
          <textarea class="daily-content" rows="20" placeholder="日记"></textarea>
        </div>
      </div>
      <div class="notepad-footer" :class="{'male-theme': userSex === 1, 'female-theme': userSex === 0}">
        <div class="select-item-wrap">
          <span class="mood-select icon-mood-happy"></span>
          <span class="weather-select icon-weather-sunny"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data: function() {
      return {
        show: this.notepadShow
      };
    },
    props: {
      userSex: {
        type: Number
      },
      notepadShow: {
        type: Boolean
      }
    },
    methods: {
      closeNotepad: function() {
        this.show = false;
        this.$emit('notepad-close', this.show);
      }
    },
    watch: {
      notepadShow: function(val) {
        this.show = val;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .notepad-wrapper
    position: fixed
    width: 100%
    height: 100%
    top: 0
    left: 0
    background-color: #fff
    &.notepad-slide-enter
      transform: translate3d(0,100%,0)
    &.notepad-slide-enter-active
      transition: all .5s ease
    &.notepad-slide-enter-to
      transform: translate3d(0,0,0)
    &.notepad-slide-leave-to
      transform: translate3d(0,100%,0)
    &.notepad-slide-leave-active
      transition: all .5s ease
    .notepad-header
      display: flex
      justify-content: space-around
      align-items: flex-end
      width: 100%
      height: 55px
      padding-bottom: 15px
      text-align: center
      color: #fff
      &.male-theme
        background-color: #4889B4
      &.female-theme
        background-color: #FE706F
      .close-btn
        flex: 1
        font-size: 20px
      .date
        flex: 5
      .save-btn
        flex: 1
    .notepad-main
      padding: 18px
      .title-input
        height: 40px
        line-height: 40px
        border-bottom-1px(rgba(160,157,153,0.4))
        input
          width: 100%
          height: 40px
          line-height: 40px
          padding-left: 5px
          &:focus
            outline: none
      .content-input
        width: 100%
        height: 80%
        padding-top: 20px
        .daily-content
          width: 100%
          height: 100%
          font-size: 16px
          border: 0
          font-family: "Microsoft YaHei"
          &:focus
            outline: none
    .notepad-footer
      position: absolute
      width: 100%
      height: 40px
      bottom: 0
      left: 0
      &.male-theme
        background-color: #4889B4
      &.female-theme
        background-color: #FE706F
      .select-item-wrap
        height: 40px
        padding-right: 20px
        text-align: right
        span
          display: inline-block
          width: 35px
          height: 35px
          line-height: 40px
          font-size: 25px
          color: rgba(255,255,255,0.4)
</style>
