<template>
  <transition name="notepad-slide">
    <div class="notepad-wrapper" v-show="show">
      <div class="notepad-header" :class="{'male-theme': allData.userSex === 1, 'female-theme': allData.userSex === 0}">
        <div class="close-btn icon-close" @click="closeNotepad"></div>
        <div class="date">{{allData.curTime | formateTime}}</div>
        <div class="save-btn" @click="uploadDaily">{{saveBtnStatus}}</div>
      </div>
      <div class="notepad-main">
        <div class="title-input">
          <input type="text" placeholder="标题" v-model="titleVal">
        </div>
        <div class="content-input">
          <textarea class="daily-content" rows="20" placeholder="日记" v-model="contentVal"></textarea>
        </div>
      </div>
      <div class="notepad-footer" :class="{'male-theme': allData.userSex === 1, 'female-theme': allData.userSex === 0}">
        <div class="select-item-wrap">
          <span class="mood-select" :class="curMoodClass" @click="selectMood"></span>
          <span class="weather-select" :class="curWeatherClass" @click="selectWeather"></span>
        </div>
      </div>
      <extra-selector :classList="selectorClassList" :selectorToggleShow="selectorShow" @selector-change="listenSelectorChange" @selector-show-change="listenSelectorShow"></extra-selector>
      <alert-dialog :dialog-show="dialogShowStatus" :txt="dialogTxt" @dialog-show-change="listenDialogShow"></alert-dialog>
      <select-dialog :txt="selectDialogTxt" :show="selectDialogShowStatus" @confirm="confrimClose" @cancel="cancelClose"></select-dialog>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import dailyExtraSelector from 'components/selectMoodandWeather/selectMoodAndWeather.vue';
  import alertDialog from 'components/alertDialog/alertdialog.vue';
  import selectDialog from 'components/selectDialog/selectdialog.vue';
  import {formateDate} from 'common/js/formateDate.js';
  import {getLocalStorage} from 'common/js/localStorage.js';

  const WEATHER_CLASS_LIST = ['icon-weather-sunny', 'icon-weather-cloudy', 'icon-weather-rainny', 'icon-weather-snowly'];
  const MOOD_CLASS_LIST = ['icon-mood-happy', 'icon-mood-normal', 'icon-mood-sadness'];
  const MOOD_SELECT_TYPE = 0;
  const WEATHER_SELECT_TYPE = 1;
  const SUCCESS_CODE = 200;
  const ERROR_CODE = 400;
  const ADD_DAILY_CODE = 0;
  const MODIFY_DAILY_CODE = 1;

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
   *          处理后将保存在 curSelectType 这个变量中记录当前选择的是心情选项还是天气选项
   *
   *          之后显示 selectMoodAndWeather 组件中
   *          选项内容初始化也交给 selectMood 和 selectWeather 处理
   *          他们会把对应的icon 类名数组保存在  selectorClassList 这个变量中
   *          这个变量将会传递给 selectMoodAndWeather 组件
   *          selectMoodAndWeather 组件做的就是将其遍历生成选项内容
   *
   *          当子组件选择完成后会触发 selector-change 事件
   *          这个事件交给 listenSelectorChange 方法处理这个方法接收一个参数是子组件选项的下标值
   *          父组件操作流程如下
   *              1、判断此时 curSelectType 的代替码是多少
   *                 0：选择了心情选项
   *                 1：选择了天气选项
   *
   *              2、通过以上的代替码确定当前选择了哪个选项
   *                 根据这个选项便可以做如下操作：
   *                 1）根据对应的代替码 找到对应的选项内容类名数组
   *                 2）根据子组件传递过来的下标值确定具体类名
   *                 3）确定类名后格式化要输出的类名 格式为 'active 某个选项内容的类名'并保存到与其对应类名变量中（curMoodClass 或 curWeatherClass）
   *
   *
   *
   */

  export default {
    data: function() {
      return {
        show: this.notepadShow, // 编辑日记组件显示/隐藏
        curEditType: ADD_DAILY_CODE,         // 记录当前的输入环境 0 表示新增日记， 1 表示编辑日记
        saveBtnStatus: '保存',  // 按钮内容
        titleVal: this.allData.title,
        contentVal: this.allData.content,
        selectorShow: false,
        selectorClassList: [],  // 用作更换心情/ 天气组件中的选项
        dialogShowStatus: false,
        dialogTxt: '',
        selectDialogShowStatus: false,
        selectDialogTxt: '',
        curSelectType: -1,
        curMoodType: this.allData.moodType,       // 保存选择的心情内容类型代替码 用作传输给后台和锁定切换的类名
        curWeatherType: this.allData.weatherType, // 同上
        curMoodClass: 'icon-mood-happy',          // 保存要切换的心情选项类名
        curWeatherClass: 'icon-weather-sunny'     // 保存要切换的天气选项类名
      };
    },
    props: {
      allData: {
        type: Object
      },
      notepadShow: {
        type: Boolean
      }
    },
    components: {
      'extra-selector': dailyExtraSelector,
      'alert-dialog': alertDialog,
      'select-dialog': selectDialog
    },
    methods: {
      initNotepad: function() {
        this.curSelectType = -1;
        this.curMoodType = -1;
        this.curWeatherType = -1;
        this.curMoodClass = 'icon-mood-happy';
        this.curWeatherClass = 'icon-weather-sunny';
        this.contentVal = '';
        this.titleVal = '';
        this.saveBtnStatus = '保存';
      },
      closeNotepad: function() {
        if(this.contentVal === '' || this.saveBtnStatus === '已保存') {
          this.$emit('notepad-close');
          // 初始化日记输入组件
          this.initNotepad();
        }else {
          this.selectDialogShowStatus = true;
          this.selectDialogTxt = '你确定要离开编辑日记吗';
        }
      },
      confrimClose: function(bool) {
        this.selectDialogShowStatus = bool;
        // 初始化日记输入组件
        this.initNotepad();
        this.$emit('notepad-close');
      },
      cancelClose: function(bool) {
        this.selectDialogShowStatus = bool;
      },
      uploadDaily: function() {
        if(this.saveBtnStatus !== '已保存') {
          if(this.contentVal === '') {
            this.dialogShowStatus = true;
            this.dialogTxt = '你还没有输入日记内容哦';
          }else {
            let data = JSON.parse(getLocalStorage('ohMyDaily').userData);
            let userId = data.id;
            let connectId = data.connect;

            if(this.editType === ADD_DAILY_CODE) {
              this.$http.post('/yourdaily/php/user/uploadDaily.php', {
                id: userId,
                title: this.titleVal,
                content: this.contentVal,
                mood: this.curMoodType,
                weather: this.curWeatherType
              }, {emulateJSON: true}).then(res => {
                if(res.body.status === SUCCESS_CODE) {
                  this.saveBtnStatus = '已保存';
                  // 触发上一级父组件事件
                  this.$emit('has-upload', userId, connectId);
                }else if(res.body.status === ERROR_CODE) {
                  this.dialogShowStatus = true;
                  this.dialogTxt = '很抱歉，日记未能保存请检查你的网络';
                }
              });
            }else if(this.editType === MODIFY_DAILY_CODE) {
              this.$http.post('/yourdaily/php/user/modifyDaily.php', {
                dailyId: this.allData.dailyId,
                title: this.titleVal,
                content: this.contentVal,
                mood: this.curMoodType,
                weather: this.curWeatherType
              }, {emulateJSON: true}).then(res => {
                if(res.body.status === SUCCESS_CODE) {
                  this.saveBtnStatus = '已保存';
                  // 触发上一级父组件事件
                  this.$emit('has-upload', userId, connectId);
                }else if(res.body.status === ERROR_CODE) {
                  this.dialogShowStatus = true;
                  this.dialogTxt = '很抱歉，日记未能保存请检查你的网络';
                }
              });
            }
          }
        }
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
          this.curMoodType = val;
          console.log('当前选择的类型：' + this.curSelectType);
          console.log('当前心情类型：' + this.curMoodType);
        }

        if(this.curSelectType === WEATHER_SELECT_TYPE) {
          this.curWeatherType = val;
          console.log('当前选择的类型：' + this.curSelectType);
          console.log('当前天气类型：' + this.curWeatherType);
        }
      },
      listenSelectorShow: function(bool) {
        this.selectorShow = bool;
      },
      listenDialogShow: function(bool) {
        this.dialogShowStatus = bool;
      }
    },
    filters: {
      formateTime: function(val) {
        return formateDate(val, 'yyyy-MM-dd');
      }
    },
    watch: {
      notepadShow: function(val) {
        this.show = val;
      },
      curMoodType: function(val) {
        if(val !== -1) {
          let curClass = MOOD_CLASS_LIST[val];
          this.curMoodClass = 'active ' + curClass;
        }
      },
      curWeatherType: function(val) {
        if(val !== -1) {
          let curClass = WEATHER_CLASS_LIST[val];
          this.curWeatherClass = 'active ' + curClass;
        }
      },
      allData: function(val) {
        this.editType = val.editType;
        this.titleVal = val.title;
        this.contentVal = val.content;
        this.curMoodType = val.moodType;
        this.curWeatherType = val.weatherType;
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
    z-index: 55
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
