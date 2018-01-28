<template>
  <div class="daily-wrapper">
    <transition name="loading-icon-slide">
      <div class="loading-icon" v-show="loadingIconShow">
        <img src="./loading.gif">
      </div>
    </transition>
    <div class="no-daily-hint" v-show="userDaily.length === 0">
      <h3 class="hint-title">NO Enteries</h3>
      <p class="hint-txt">你还没有写过日记</p>
      <p class="begin-write-daily" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}"
         @click="showNotepad">开始写日记</p>
    </div>
    <div class="daily-list-wrap">
      <scroll-view :content="userDaily" ref="scroll" @ontouchend="refreshDaily">
        <ul class="daily-list">
          <daily-item v-for="(daily, key) in userDaily" :daily="daily" :dailykey="key" :key="key" @enter-dailydetail="enterDailyDetail"></daily-item>
        </ul>
      </scroll-view>
    </div>
    <div class="daily-bottom-bar" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}"
         v-show="userDaily.length !== 0">
      <span class="write-daily-btn icon-pen" @click="showNotepad"></span>
      <span class="total-daily-num">{{userInfo.count}}篇日记</span>
    </div>
    <daily-notepad :all-data="notepadData" :notepad-show="notepadShow" @notepad-close="notepadClose"></daily-notepad>
    <daily-detail-dialog :detail-data="dailyDetail" :detail-dialog-show="detailDialogShow"
                         @detail-dialog-close="detailDialogClose"></daily-detail-dialog>
    <alert-dialog :dialog-show.sync="dialogShowStatus" :txt="dialogTxt"></alert-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 日记列表组件
   *
   * 当前面user 组件进行了一连串的对用户性别的判断到最后会采用的异步的过程跳转到这个daily 组件中
   * 组件可能还没有获得数据 不过没关系 vue 的响应式数据会为这个组件异步填充数据
   *
   * 而这个组件会执行如下一系列的初始化动作：
   *   1、 通过 vuex共享数据userData 获取用户的性别 初始化组件各部分的样式 实现不同性别用户不同风格
   *
   *   2、判断用户数据中的日记内容是否为空 为空会显示class 为 no-daily-hint 这个元素 否则隐藏
   *
   * 写日记的功能：
   *   写日记功能基本在dailynotepad 组件中实现 请看dailynotepad 组件的注释
   */

  import dailyNotePad from 'components/dailyNotePad/dailynotepad.vue';
  import dailyDetailDialog from 'components/dailyDetailDialog/dailyDetailDialog.vue';
  import dailyItem from 'base/dailyItem/dailyItem.vue';
  import scrollView from 'base/scrollView/scrollView.vue';
  import alertDialog from 'base/alertDialog/alertdialog.vue';
  import {mapGetters, mapActions} from 'vuex';


  export default {
    data: function () {
      return {
        loadingIconShow: false,
        notepadData: {},
        notepadShow: false,
        dailyDetail: {},
        detailDialogShow: false,
        dialogShowStatus: false,
        dialogTxt: ''
      };
    },
    components: {
      'daily-notepad': dailyNotePad,
      'daily-detail-dialog': dailyDetailDialog,
      'scroll-view': scrollView,
      'daily-item': dailyItem,
      'alert-dialog': alertDialog
    },
    methods: {
      ...mapActions([
        'reloadData'
      ]),
      notepadClose() {
        this.notepadShow = false;
        this.detailDialogShow = false;
      },
      showNotepad() {
        // 当在日记组件中点击添加日记按钮的时候对日记编辑组件进行数据的初始化
        this.notepadData = {
          curTime: new Date(),
          userSex: parseInt(this.userInfo.sex),
          title: '',
          content: '',
          moodType: -1,
          weatherType: -1
        };
        this.notepadShow = true;
      },
      detailDialogClose() {
        this.detailDialogShow = false;
      },
      outputMoodClass(val) {
        if (val !== -1) {
          return this.moodClassList[val];
        }
      },
      outputWeatherClass(val) {
        if (val !== -1) {
          return this.weatherClassList[val];
        }
      },
      enterDailyDetail(key) {
        if (event._constructed) {
          let detail = this.userDaily[key];

          this.dailyDetail = {
            dailyId: detail.id,
            time: detail.publicTime,
            title: detail.title,
            content: detail.content,
            userId: detail.userId,
            sex: parseInt(detail.sex),
            images: detail.image === '' ? [] : detail.image.split(',')
          };

          this.detailDialogShow = true;
        }
        ;
      },
      _toggleDialogShow(txt = '') {
        this.dialogShowStatus = !this.dialogShowStatus;
        this.dialogTxt = txt;
      },
      _toggleLoadingIconShow() {
        this.loadingIconShow = !this.loadingIconShow;
      },
      refreshDaily(pos) {
        if (pos.y > 50) {
          this._toggleLoadingIconShow();
          this.reloadData({
            id: this.userInfo.id,
            connectId: this.userInfo.connect
          }).then(() => {
            setTimeout(() => {
              this._toggleLoadingIconShow();
            }, 800);
          }).catch(() => {
            this._toggleLoadingIconShow();
            this._toggleDialogShow('你的网络出现问题了。');
          });
        }
      }
    },
    watch: {
      userDaily(val) {
        this.$refs.scroll.refresh();
      }
    },
    computed: {
      ...mapGetters({
        userDaily: 'getDaily',
        userInfo: 'getInfo'
      })
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

  .daily-wrapper
    position: relative
    width: 100%
    height: 100%
    .loading-icon
      position: absolute
      top: 130px
      left: 50%
      width: 30px
      height: 30px
      line-height: 30px
      margin-left: -15px
      border-radius: 50%
      background-color: #fff
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.8)
      text-align: center
      font-size: 0
      z-index: 5
      &.loading-icon-slide-enter
        top: 0
      &.loading-icon-slide-enter-to
        top: 130px
      &.loading-icon-slide-enter-active
        transition: all .4s ease
      img
        vertical-align: middle
    .no-daily-hint
      position: absolute
      width: 300px
      height: 200px
      top: 50%
      left: 50%
      margin: -100px 0 0 -150px
      border-radius: 5px
      background-color: #fff
      z-index: 10
      .hint-title
        line-height: 40px
        margin-top: 30px
        font-size: 40px
        color: #757675
        text-align: center
      .hint-txt
        line-height: 20px
        margin-top: 20px
        font-size: 20px
        color: #757675
        text-align: center
      .begin-write-daily
        margin-top: 40px
        font-size: $font-size-large
        text-align: center
        text-decoration: underline
        &.male-theme
          color: $male-color;
        &.female-theme
          color: $female-color
    .daily-list-wrap
      position: absolute
      top: 100px
      bottom: 50px
      width: 100%
      overflow: hidden
      .daily-list
        padding-bottom: 20px
    .daily-bottom-bar
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: 50px
      &.male-theme
        background-color: $male-color
        .write-daily-btn
          color: $male-color
      &.female-theme
        background-color: $female-color
        .write-daily-btn
          color: $female-color
      .write-daily-btn
        position: absolute
        display: inline-block
        top: 50%
        left: 50%
        width: 30px
        height: 30px
        line-height: 30px
        margin: -15px 0 0 -15px
        border-radius: 5px
        background-color: #fff
        text-align: center
        font-size: 20px
        font-weight: bold
      .total-daily-num
        position: absolute
        right: 10px
        top: 10px
        line-height: 30px
        color: #fff
</style>
