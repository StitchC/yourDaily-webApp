<template>
  <div class="calendar-wrapper">
    <div class="calendar-main" :class="{'male-theme':userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}">
      <div class="reward-btn icon-arrow-left" @click="rewardDate"></div>
      <div class="date-txt">
        <p class="month">{{curDate | translateMonth}}月</p>
        <p class="date">{{curDate | translateDate}}</p>
        <p class="week">星期{{curDate | translateWeek}}</p>
      </div>
      <div class="next-btn icon-arrow-right" @click="nextDate"></div>
    </div>
    <div class="no-match-daily-hint" v-show="matchDailys.length === 0 && isToday">
      <div class="hint-content" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}"
           @click="addDaily">
        <span class="icon icon-pen"></span>
        <span class="txt">添加日记</span>
      </div>
    </div>
    <div class="match-daily-list-wrap" ref="scrollWrap">
      <scroll-view :content="matchDailys" ref="scroll">
        <ul class="match-daily-list">
          <daily-item v-if="daily.userId === userInfo.id" v-for="daily in matchDailys" :daily="daily" :dailykey="daily.id" :key="daily.id" @enter-dailydetail="enterDailyDetail"></daily-item>
        </ul>
      </scroll-view>
    </div>
    <daily-detail-dialog :detail-data="dailyDetail" :detail-dialog-show="detailDialogShow"
                         @detail-dialog-close="detailDialogClose" @daily-modify="modifyDaily"></daily-detail-dialog>
    <daily-notepad :all-data="notepadData" :notepad-show="notepadShow" @notepad-close="notepadClose"></daily-notepad>
  </div>
</template>

<script type="text/ecmascript-6">
  import {formateDate} from 'common/js/formateDate.js';
  import dailyDetailDialog from 'components/dailyDetailDialog/dailyDetailDialog.vue';
  import dailyNotepad from 'components/dailyNotePad/dailynotepad.vue';
  import dailyItem from 'base/dailyItem/dailyItem.vue';
  import {mapGetters} from 'vuex';
  import scrollView from 'base/scrollView/scrollView.vue';

  export default {
    data() {
      return {
        userSex: -1,
        curDate: new Date().getTime(),
        scroll: null,
        dailyDetail: {},
        detailDialogShow: false,
        notepadData: {},
        notepadShow: false
      };
    },
    mounted() {
      let width = window.outerWidth;
      setTimeout(() => {
        this.$refs.scrollWrap.style.top = width + 'px';
        this.$refs.scroll.refresh();
      }, 50);
    },
    components: {
      'daily-detail-dialog': dailyDetailDialog,
      'daily-notepad': dailyNotepad,
      'scroll-view': scrollView,
      'daily-item': dailyItem
    },
    methods: {
      rewardDate() {
        let date = new Date(this.curDate);
        this.curDate = date.setDate(date.getDate() - 1);
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      nextDate() {
        let date = new Date(this.curDate);
        this.curDate = date.setDate(date.getDate() + 1);
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      addDaily() {
        console.log('fk');
        this.notepadData = {
          editType: 0,
          curTime: new Date(),
          userSex: parseInt(this.userInfo.sex),
          title: '',
          content: '',
          moodType: -1,
          weatherType: -1
        };
        this.notepadShow = true;
      },
      enterDailyDetail(key) {
        if (event._constructed) {
          let data = this.userDaily[key];
          this.dailyDetail = {
            dailyId: data.id,
            time: data.publicTime,
            title: data.title,
            content: data.content,
            userId: data.userId,
            sex: parseInt(data.sex),
            images: data.image.split(',')
          };
          this.detailDialogShow = true;
        }
        ;
      },
      detailDialogClose() {
        this.detailDialogShow = false;
      },
      modifyDaily(dailyId) {
        let data = this.userData.daily[dailyId];
        this.notepadData = {
          editType: 1,
          dailyId: data.id,
          curTime: new Date(),
          userSex: parseInt(data.sex),
          title: data.title,
          content: data.content,
          moodType: parseInt(data.mood),
          weatherType: parseInt(data.weather)
        };
        this.notepadShow = true;
      },
      notepadClose() {
        this.notepadShow = false;
        this.detailDialogShow = false;
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'getInfo',
        userDaily: 'getDaily'
      }),
      userData() {
        return this.$store.state.userData;
      },
      matchDailys() {
        let curDateStr = formateDate(this.curDate, 'yyyy-MM-dd');
        let resultList = [];

        for (let key in this.userDaily) {
          let tempArr = this.userDaily[key].publicTime.split(' ');
          let tempItem = tempArr[0];
          if (tempItem === curDateStr && this.userDaily[key].userId === this.userInfo.id) {
            resultList.push(this.userDaily[key]);
          }
        }
        console.log(resultList);
        return resultList;
      },
      isToday() {
        let todayStr = formateDate(new Date().getTime(), 'yyyy-MM-dd');
        let curDateStr = formateDate(this.curDate, 'yyyy-MM-dd');
        return todayStr === curDateStr;
      }
    },
    filters: {
      translateMonth(val) {
        let date = new Date(val);
        let month = date.getMonth();
        let monthChar = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        return monthChar[month];
      },
      translateDate(val) {
        let date = new Date(val);
        let d = date.getDate();
        return d;
      },
      translateWeek(val) {
        let date = new Date(val);
        let week = date.getDay();
        let weekChar = ['日', '一', '二', '三', '四', '五', '六'];
        return weekChar[week];
      },
      translateTime(val) {
        return formateDate(val, 'hh:mm');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

  .calendar-wrapper
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    .calendar-main
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      background-color: #fff
      &.male-theme
        .reward-btn,
        .next-btn,
        .date-txt
          color: $male-color
      &.female-theme
        .reward-btn,
        .next-btn,
        .date-txt
          color: $female-color
      .reward-btn
        position: absolute
        display: inline-block
        top: 50%
        left: 12px
        width: 40px
        height: 120px
        line-height: 120px
        font-size: $font-size-large-X
        font-weight: bold
        z-index: 20
      .next-btn
        position: absolute
        display: inline-block
        top: 50%
        right: 12px
        width: 40px
        height: 120px
        line-height: 120px
        font-size: $font-size-large-X
        font-weight: bold
        z-index: 20
      .date-txt
        position: absolute
        display: inline-block
        top: 40%
        width: 100%
        text-align: center
        .month
          font-size: $font-size-large-X
        .date
          font-size: 96px
        .week
          font-size: $font-size-large
    .no-match-daily-hint
      position: relative
      width: 90%
      height: 80px
      line-height: 80px
      margin: 10px auto 0 auto
      text-align: center
      background-color: #fff
      border-radius: 5px
      z-index: 5
      .hint-content
        .icon
          display: inline-block
          width: 30px
          height: 30px
          line-height: 30px
          border-radius: 3px
          text-align: center
          color: #fff
        .txt
          font-size: $font-size-large
        &.male-theme
          .icon
            background-color: $male-color
          .txt
            color: $male-color
        &.female-theme
          .icon
            background-color: $female-color
          .txt
            color: $female-color
    .match-daily-list-wrap
      position: absolute
      bottom: 0
      width: 100%
      overflow: hidden
      .match-daily-list
        padding-bottom: 20px
</style>
