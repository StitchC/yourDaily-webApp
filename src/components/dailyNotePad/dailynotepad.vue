<template>
  <transition name="notepad-slide">
    <div class="notepad-wrapper" v-show="show">
      <div class="notepad-header" :class="{'male-theme': allData.userSex === 1, 'female-theme': allData.userSex === 0}">
        <div class="close-btn icon-close" @click="closeNotepad"></div>
        <div class="date">{{allData.curTime | formateTime}}</div>
        <div class="save-btn" @click="uploadDaily">{{saveBtnStatus === 0 ? '保存': '已保存'}}</div>
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
        <div class="select-photo" :class="{'disabled': fileContenList.length === 3}">
          <span class="select-icon">
            <span class="icon-camera"></span>
          </span>
          <input type="file" class="file-input" @change="selectImgChange" v-show="fileContenList.length < 3">
        </div>
        <div class="select-item-wrap">
          <span class="mood-select" :class="curMoodClass" @click="selectMood"></span>
          <span class="weather-select" :class="curWeatherClass" @click="selectWeather"></span>
        </div>
      </div>
      <transition name="photo-list-fade">
        <ul class="photo-list-preview" v-show="fileContenList.length !== 0">
          <li v-for="(item, index) in fileContenList" class="img-item">
            <img :src="item.url" @click="seePhoto($event, index)">
          </li>
        </ul>
      </transition>
      <extra-selector :classList="selectorClassList" :selectorToggleShow="selectorShow" @selector-change="listenSelectorChange" @selector-show-change="listenSelectorShow"></extra-selector>
      <alert-dialog :dialog-show.sync="dialogShowStatus" :txt="dialogTxt"></alert-dialog>
      <select-dialog :txt="selectDialogTxt" :show="selectDialogShowStatus" @confirm="confrimClose" @cancel="cancelClose"></select-dialog>
      <daily-photo-view :show="photoViewShow" :photo-url="curPhotoUrl" :photo-index="curPhotoIndex" @close="photoViewClose" @delete-photo="dropPhoto"></daily-photo-view>
      <hint-dialog :show="hintDialogShow" :hint-txt="hintTxt" :delay="hintDialogDelay" @will-hide="hintDialogWillHide"></hint-dialog>
      <loading :show="loadingShow"></loading>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /**
   *  日记输入组件
   *
   *  @param {Object} allData - 初始化日记输入组件的内容
   *    格式:
   *    {
   *      title: ''              初始化组件的标题
          content: ''            初始化组件的内容
          moodType: -1           初始化组件的心情选项为 -1
          weatherType: -1        初始化组件的天气选项为 -1
          curTime: new Date()    当前日期 用于显示在编辑组件的顶部,
          userSex: parseInt(detail.sex)  用户的性别 用于更改组件的颜色风格,
   *    }
   *  @param {Boolean} notepadShow - 控制日记输入组件的关闭或显示
   *
   *
   *  重要：
   *  1、心情和天气的选择
   *  当用户点击心情图标时 会触发 selectMood 函数，此函数将会对 this.curSelectType 和 this.selectorClassList 进行修改。
   *  之后子组件 'extra-selector' 将会根据 this.selectorClassList 里面的类名进行图标的输出
   *  当子组件 'extra-selector' 选择完之后会触发 ‘selector-change’事件并且传递一个对应图标索引给父组件
   *  事件的执行函数 listenSelectorChange 会根据当前的 this.curSelectType 对 curMoodType 或 curWeatherType 附上对应类名数组索引下标，并且当提交数据时也需要这个值指定当前日记心情和天气
   *  当这两个局部变量发生改变的时候 对应的 curMoodClass 或 curWeatherClass 就会发生改变 并在类名前加上了 active 形成高亮状态
   *
   *
   *  2、日记输入组件关闭时会对它进行初始化还原 因此会执行 initNotepad 这个函数
   *  这也确保了下一次数据的一致性
   */


  import dailyExtraSelector from 'components/selectMoodandWeather/selectMoodAndWeather.vue';
  import alertDialog from 'base/alertDialog/alertdialog.vue';
  import selectDialog from 'base/selectDialog/selectdialog.vue';
  import dailyPhotoView from 'components/dailyPhotoView/dailyPhotoView.vue';
  import loading from 'base/loading/loading.vue';
  import hintDialog from 'base/hintDialog/hintDialog.vue';
  import {formateDate} from 'common/js/formateDate.js';
  import {SUCCESS_CODE, ERROR_CODE} from 'api/statusCode.js';
  import {mapGetters, mapActions} from 'vuex';
  import lrz from 'lrz';


  const DAILY_HAS_SAVE = 1;  // 日记已保存的状态码
  const DAILY_NOT_SAVE = 0;  // 日记未保存的状态码
  const WEATHER_CLASS_LIST = ['icon-weather-sunny', 'icon-weather-cloudy', 'icon-weather-rainny', 'icon-weather-snowly'];
  const MOOD_CLASS_LIST = ['icon-mood-happy', 'icon-mood-normal', 'icon-mood-sadness'];
  const MOOD_SELECT_TYPE = 0;    // 选择心情时的状态码
  const WEATHER_SELECT_TYPE = 1; // 选择天气时的状态码
  const PHOTO_LIMIT = 3;         // 日记图片的限制数

  export default {
    data() {
      return {
        show: this.notepadShow,                   // 编辑日记组件 显示 / 隐藏
        saveBtnStatus: DAILY_NOT_SAVE,            // 保存日记按钮的状态 0为 '未保存' 1为'已保存'
        titleVal: this.allData.title,
        contentVal: this.allData.content,
        selectorShow: false,                      // 心情 / 天气组件的 显示 / 隐藏
        selectorClassList: [],                    // 用作更换心情/ 天气组件中的选项
        dialogShowStatus: false,
        dialogTxt: '',
        selectDialogShowStatus: false,
        selectDialogTxt: '',
        curSelectType: -1,                        // 记录当前将要选择的是心情 还是 天气
        curMoodType: this.allData.moodType,       // 保存选择的心情内容类型代替码 用作传输给后台和锁定切换的类名
        curWeatherType: this.allData.weatherType, // 同上
        curMoodClass: 'icon-mood-happy',          // 保存要切换的心情选项类名控制着选择按钮的高亮状态
        curWeatherClass: 'icon-weather-sunny',    // 保存要切换的天气选项类名控制着选择按钮的高亮状态
        fileContenList: [],                       // 保存着日记图片的二进制内容以及用作预览的 url
        curPhotoUrl: '',                          // 预览图片的 url
        curPhotoIndex: -1,                        // 当前预览图的数组下标 用作删除时的联系
        curPhotoName: [],                         // 保存以选择的图片名
        photoViewShow: false,                     // 大图预览组件的显示 / 隐藏
        loadingShow: false,
        hintDialogShow: false,
        hintTxt: '',
        hintDialogDelay: 800
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
      'select-dialog': selectDialog,
      'daily-photo-view': dailyPhotoView,
      'hint-dialog': hintDialog,
      'loading': loading
    },
    methods: {
      ...mapActions([
        'reloadData'
      ]),
      _toggleSelectDialog(txt = '') {
        this.selectDialogShowStatus = !this.selectDialogShowStatus;
        this.selectDialogTxt = txt;
      },
      _toggleDialogShow(txt = '') {
        this.dialogShowStatus = !this.dialogShowStatus;
        this.dialogTxt = txt;
      },
      _toggleLoadingShow() {
        this.loadingShow = !this.loadingShow;
      },
      _toggleHintDialogShow(txt = '') {
        this.hintDialogShow = !this.hintDialogShow;
        this.hintTxt = txt;
      },
      initNotepad() {
        this.curSelectType = -1;
        this.curMoodType = -1;
        this.curWeatherType = -1;
        this.curMoodClass = 'icon-mood-happy';
        this.curWeatherClass = 'icon-weather-sunny';
        this.contentVal = '';
        this.titleVal = '';
        this.saveBtnStatus = DAILY_NOT_SAVE;
        this.fileContenList = [];
        this.curPhotoName = [];
      },
      closeNotepad() {
        if((this.contentVal === '' && this.fileContenList.length === 0) || this.saveBtnStatus === DAILY_HAS_SAVE) {
          this.$emit('notepad-close');
          // 初始化日记输入组件
          this.initNotepad();
        }else {
          this._toggleSelectDialog('你确定要离开编辑日记吗');
        }
      },
      confrimClose() {
        this.selectDialogShowStatus = false;
        // 初始化日记输入组件
        this.initNotepad();
        this.$emit('notepad-close');
      },
      cancelClose() {
        // 关闭选择对话框
        this._toggleSelectDialog();
      },
      _doUploadDaily(url, args) {
        return this.$http.post(url, args, {
          before() {
            this._toggleLoadingShow();
          }
        });
      },
      _formatForm() {
        let formdata = new FormData();
        // 遍历所有文件保存到 formdata
        if(this.fileContenList.length > 0) {
          for(let i = 0; i < this.fileContenList.length; i++) {
            formdata.append('file[]', this.fileContenList[i].content);
          };
        }
        // 保存所有除图片外的日记信息
        let baseData = {
          id: this.userInfo.id,
          title: this.titleVal,
          content: this.contentVal,
          mood: this.curMoodType,
          weather: this.curWeatherType
        };
        // 遍历日记信息 保存到 formdata
        for(let key in baseData) {
          formdata.append(key, baseData[key]);
        };

        return formdata;
      },
      uploadDaily() {
        if(this.saveBtnStatus !== DAILY_HAS_SAVE) {
          if(this.contentVal === '') {
            this.dialogShowStatus = true;
            this.dialogTxt = '你还没有输入日记内容哦';
          }else {
            let formdata = this._formatForm();

            this._doUploadDaily('/yourdaily/php/user/uploadDaily.php', formdata).then(res => {
              if(res.body.status === SUCCESS_CODE) {
                this.saveBtnStatus = DAILY_HAS_SAVE;
                // 发布成功后 发送ajax 请求 更新vuex 数据
                this.reloadData({
                  id: this.userInfo.id,
                  connectId: this.userInfo.connect
                }).then(() => {
                  // 隐藏加载提示框
                  this._toggleLoadingShow();
                  // 显示提醒框
                  this._toggleHintDialogShow('保存成功');
                });
              }else if(res.body.status === ERROR_CODE) {
                // 隐藏加载提示框
                this._toggleLoadingShow();
                this._toggleDialogShow('很抱歉，日记未能保存请检查你的网络');
              }
            }).catch(() => {
              // 隐藏加载提示框
              this._toggleLoadingShow();
              this._toggleDialogShow('很抱歉，日记未能保存请检查你的网络');
            });
          }
        }
      },
      hintDialogWillHide(promise) {
        promise.then(() => {
          // 隐藏提示对话框
          this._toggleHintDialogShow();
        });
      },
      selectMood() {
        this.curSelectType = MOOD_SELECT_TYPE;
        this.selectorClassList = MOOD_CLASS_LIST;
        this.selectorShow = true;
      },
      selectWeather() {
        this.curSelectType = WEATHER_SELECT_TYPE;
        this.selectorClassList = WEATHER_CLASS_LIST;
        this.selectorShow = true;
      },
      listenSelectorChange(val) {
        if(this.curSelectType === MOOD_SELECT_TYPE) {
          this.curMoodType = val;
        }

        if(this.curSelectType === WEATHER_SELECT_TYPE) {
          this.curWeatherType = val;
        }
      },
      listenSelectorShow(bool) {
        this.selectorShow = bool;
      },
      selectImgChange(event) {
        let file = event.target.files[0];
        let reg = /image\/(jpg|png|jpeg)/;
        // 判断文件是否存在或数量是否已达到标准
        // 满足则返回空值结束函数
        if(!file || this.fileContenList.length === PHOTO_LIMIT) {
          return;
        }
        // 文件名不符显示提示框 返回空值结束函数
        if(!reg.test(file.type)) {
          this._toggleDialogShow('上传的图片格式只能为 jpg,png,jpeg 哦');
          return;
        }
        // 是否有相同文件名
        // 符合则返回控制结束函数
        if(this.curPhotoName.indexOf(file.name) !== -1) {
          return;
        }
        // 以上条件均不成立 对文件进行读取显示
        // 保存文件数据 用作上传

        // 显示加载提示框
        this._toggleLoadingShow();
        // 压缩图片
        lrz(file).then((rst) => {
          let fileObj = {
            content: rst.file,
            url: rst.base64
          };
          this.fileContenList.push(fileObj);
          this.curPhotoName.push(rst.origin.name);
          // 隐藏加载提示框
          this._toggleLoadingShow();
        });
      },
      seePhoto(event, index) {
        this.curPhotoUrl = this.fileContenList[index].url;
        this.photoViewShow = true;
        this.curPhotoIndex = index;
      },
      photoViewClose() {
        this.photoViewShow = false;
      },
      dropPhoto(index) {
        this.fileContenList.splice(index, 1);
        this.curPhotoName.splice(index, 1);
        this.photoViewShow = false;
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'getInfo'
      })
    },
    filters: {
      formateTime(val) {
        return formateDate(val, 'yyyy-MM-dd');
      }
    },
    watch: {
      notepadShow(val) {
        this.show = val;
      },
      curMoodType(val) {
        if(val !== -1) {
          let curClass = MOOD_CLASS_LIST[val];
          this.curMoodClass = 'active ' + curClass;
        }
      },
      curWeatherType(val) {
        if(val !== -1) {
          let curClass = WEATHER_CLASS_LIST[val];
          this.curWeatherClass = 'active ' + curClass;
        }
      },
      allData(val) {
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
  @import "../../common/stylus/theme.styl"

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
        background-color: $male-color
      &.female-theme
        background-color: $female-color
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
          font-size: $font-size-large
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
        background-color: $male-color
      &.female-theme
        background-color: $female-color
      .select-photo
        position: relative
        display: inline-block
        width: 40px
        height: 40px
        line-height: 40px
        padding-left: 5px
        text-align: center
        color: #fff
        &.disabled
          color: rgba(255,255,255,0.3)
        .select-icon
          position: absolute
          top: 0px
          left: 10px
          font-size: $font-size-large-X
        .file-input
          width: 100%
          opacity: 0
      .select-item-wrap
        float: right
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

    .photo-list-preview
      position: fixed
      left: 0
      bottom: 40px
      width: 100%
      height: 50px
      background-color: rgba(0,0,0,0.3)
      text-align: center
      &.photo-list-fade-enter
        opacity: 0
      &.photo-list-fade-enter-to
        opacity: 1
      &.photo-list-fade-enter-active
        transition: all .5s ease
      .img-item
        display: inline-block
        width: 50px
        height: 50px
        line-height: 50px
        margin: 0 5px
        overflow: hidden
        img
          width: 100%
          vertical-align: middle
</style>
