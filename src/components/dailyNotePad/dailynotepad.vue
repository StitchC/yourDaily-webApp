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
          <span class="mood-select" :class="[{'icon-mood-happy': curSelectType === -1 || curMoodType === -1}, curMoodClass === '' ? '' : curMoodClass]" @click="selectMood"></span>
          <span class="weather-select" :class="[{'icon-weather-sunny': curSelectType === -1 || curWeatherType === -1}, curWeatherClass === '' ? '' : curWeatherClass]" @click="selectWeather"></span>
        </div>
      </div>
      <extra-selector :classList="selectorClassList" :selectorToggleShow="selectorShow" @selector-change="listenSelectorChange" @selector-show-change="listenSelectorShow"></extra-selector>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import dailyExtraSelector from 'components/selectMoodandWeather/selectMoodAndWeather.vue';

  const WEATHER_CLASS_LIST = ['icon-weather-sunny', 'icon-weather-cloudy', 'icon-weather-rainny', 'icon-weather-snowly'];
  const MOOD_CLASS_LIST = ['icon-mood-happy', 'icon-mood-normal', 'icon-mood-sadness'];
  const MOOD_SELECT_TYPE = 0;
  const WEATHER_SELECT_TYPE = 1;

  /**
   *  日记输入组件
   *
   *  组件的初始化是根据父组件传递过来的 userSex 参数切换对应的风格
   *
   *  重要功能能（选择心情和选择天气）
   *      此功能由 selectMoodAndWeather 组件实现
   *      思路如下：
   *          先定义几个常量：
   *          WEATHER_CLASS_LIST：保存要初始化的天气icon 类名
   *          MOOD_CLASS_LIST：保存要初始化的心情icon 类名
   *          MOOD_SELECT_TYPE：定义心情选项的代替码
   *          WEATHER_SELECT_TYPE：定义天气选项的代替码
   *
   *          当点击心情选项或天气选项的时候会自动获取对应的代替码
   *          这个交给 selectMood 和 selectWeather 处理
   *          处理后将保存在 curSelectType 这个变量中
   *
   *          而对 selectMoodAndWeather 组件中的选项初始化也交给 selectMood 和 selectWeather 处理
   *          他们会把对应的icon 类名数组保存在  selectorClassList 这个变量中
   *          这个变量将会传递给 selectMoodAndWeather 组件
   *          selectMoodAndWeather 组件做的就是将其遍历
   *          同时 curSelectType 将会保存当前点击的选项的代替码
   *
   *          当子组件选择完成后会触发 selector-change 事件
   *          这个事件交给 listenSelectorChange 方法处理这个方法接收一个参数是子组件选项的下标值
   *          具体处理如下
   *              1、确认当前点击的选项（是天气或是心情）
   *                 如果是心情即将子组件传过来的下标值保存在 curMoodType 变量中
   *                 否则保存在 curWeatherType 中
   *
*                 2、格式化类名
   *                 这个类名将会添加到选项中 并且改变他们的样式
   *                 通过子组件传递过来的下标值中 在对应icon类名数组中找到对应索引的值
   *                 整理后的类名格式为：'active 对应icon类名'
   *                 最后会在选项中加上如下语句控制类名
   *                 [{'icon-mood-happy': curSelectType === -1 || curMoodType === -1}, curMoodClass === '' ? '' : curMoodClass]
   *                 意思为： 如果当前没有选择任何天气或心情 或者 现在是初始化你并没有点击选项 那么将会加上默认的类名
   *                 如果你选择了 就会加上对应的 已经格式化好了的类名
   *                 
   */

  export default {
    data: function() {
      return {
        show: this.notepadShow,
        selectorShow: false,
        selectorClassList: [],
        curSelectType: -1,
        curMoodType: -1,
        curWeatherType: -1,
        curMoodClass: '',
        curWeatherClass: ''
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
    components: {
      'extra-selector': dailyExtraSelector
    },
    methods: {
      closeNotepad: function() {
        this.$emit('notepad-close', !this.show);
      },
      selectMood: function() {
        this.curSelectType = MOOD_SELECT_TYPE;
        this.selectorClassList = MOOD_CLASS_LIST;
        this.selectorShow = true;
      },
      selectWeather: function() {
        this.curSelectType = WEATHER_SELECT_TYPE;
        this.selectorClassList = WEATHER_CLASS_LIST;
        this.selectorShow = true;
      },
      listenSelectorChange: function(val) {
        if(this.curSelectType === MOOD_SELECT_TYPE) {
          let className = this.selectorClassList[val];
          this.curMoodType = val;
          this.curMoodClass = 'active ' + className;
        }

        if(this.curSelectType === WEATHER_SELECT_TYPE) {
          let className = this.selectorClassList[val];
          this.curWeatherType = val;
          this.curWeatherClass = 'active ' + className;
        }
      },
      listenSelectorShow: function(bool) {
        this.selectorShow = bool;
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
          &.active
            color: #fff
            font-weight: bold

</style>
