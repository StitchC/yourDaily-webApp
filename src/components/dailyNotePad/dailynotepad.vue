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

  const WEATHER_CLASS_LIST = ['icon-weather-sunny', 'icon-weather-cloudy', 'icon-weather-rainny', 'icon-weather-snowly'];
  const MOOD_CLASS_LIST = ['icon-mood-happy', 'icon-mood-normal', 'icon-mood-sadness'];
  const MOOD_SELECT_TYPE = 0;    // 选择心情时的状态码
  const WEATHER_SELECT_TYPE = 1; // 选择天气时的状态码
  const SUCCESS_CODE = 200;
  const ERROR_CODE = 400;
  const ADD_DAILY_CODE = 0;    // 新增日记状态的状态码
  const MODIFY_DAILY_CODE = 1; // 编辑日记状态的状态码

  /**
   *  日记输入组件
   *
   *  参数：
   *  allData（初始化日记输入组件的内容）
   *    类型: Object
   *    格式:
   *    {
   *      editType:  激活组件时的编辑类型，"0"：新建日记  "1"：编辑已有日记,
          dailyId: detail.id   如果是编辑状态词属性存在用于保存当前编辑日记的id,
          curTime: new Date()  当前日期 用于显示在编辑组件的顶部,
          userSex: parseInt(detail.sex)  用户的性别 用于更改组件的颜色风格,
          title: detail.title  日记标题，如果是新增日记则填入空内容如果不是填入已有日记的题目,
          content: detail.content  日记内容用法同上,
          moodType: parseInt(detail.mood)  心情类型，如果是新增日记填入 -1 如果不是填入对应的心情类型编码,
          weatherType: parseInt(detail.weather)   天气类型，用法同上
   *    }
   *  notepadShow（控制日记输入组件的关闭或显示）
   *    类型: Boolean
   *
   *
   *  重要：
   *  1、心情和天气的选择
   *  当用户点击心情图标时 会触发 selectMood 函数，此函数将会对 this.curSelectType 和 this.selectorClassList 进行修改。
   *  之后子组件 'extra-selector' 将会根据 this.selectorClassList 里面的类名进行图标的输出
   *  当子组件 'extra-selector' 选择完之后会触发 ‘selector-change’事件并且传递一个对应 this.selectorClassList 数组的索引下标
   *  事件的执行函数 listenSelectorChange 会根据当前的 this.curSelectType 对 curMoodType 或 curWeatherType 附上对应类名数组索引下标，并且当提交数据时也需要这个值指定当前日记心情和天气
   *  当这两个局部变量发生改变的时候 对应的 curMoodClass 或 curWeatherClass 就会发生改变 并在类名前加上了 active 形成高亮状态
   *
   *
   *  2、日记输入组件关闭时会对它进行初始化还原 因此会执行 initNotepad 这个函数
   *  这也确保了下一次无论是用作修改日记或新增日记时数据的一致性（尤其是在修改日记时尤为明显）
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
        curMoodClass: 'icon-mood-happy',          // 保存要切换的心情选项类名控制着选择按钮的高亮状态
        curWeatherClass: 'icon-weather-sunny'     // 保存要切换的天气选项类名控制着选择按钮的高亮状态
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
            if(this.editType === ADD_DAILY_CODE) {
              this.$http.post('/yourdaily/php/user/uploadDaily.php', {
                id: this.userData.info.id,
                title: this.titleVal,
                content: this.contentVal,
                mood: this.curMoodType,
                weather: this.curWeatherType
              }, {emulateJSON: true}).then(res => {
                if(res.body.status === SUCCESS_CODE) {
                  this.saveBtnStatus = '已保存';
                  // 发布成功后 发送ajax 请求 更新vuex 数据
                  this.$store.dispatch('requestNewData', {
                    id: this.userData.info.id,
                    connectId: this.userData.info.connect
                  });
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
                  // 修改成功后发送ajax 请求 更新vuex 数据
                  this.$store.dispatch('requestNewData', {
                    id: this.userData.info.id,
                    connectId: this.userData.info.connect
                  });
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
        }

        if(this.curSelectType === WEATHER_SELECT_TYPE) {
          this.curWeatherType = val;
        }
      },
      listenSelectorShow: function(bool) {
        this.selectorShow = bool;
      },
      listenDialogShow: function(bool) {
        this.dialogShowStatus = bool;
      }
    },
    computed: {
      userData: function() {
        return this.$store.state.userData;
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
