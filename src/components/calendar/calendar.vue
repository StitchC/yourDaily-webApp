<template>
  <div class="calendar-wrapper">
    <div class="calendar-main" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}">
      <div class="reward-btn icon-arrow-left" @click="rewardDate"></div>
      <div class="date-txt">
        <p class="month">{{curDate | translateMonth}}月</p>
        <p class="date">{{curDate | translateDate}}</p>
        <p class="week">星期{{curDate | translateWeek}}</p>
      </div>
      <div class="next-btn icon-arrow-right" @click="nextDate"></div>
    </div>
    <div class="no-match-daily-hint" v-show="matchDailys.length === 0 && isToday">
      <div class="hint-content" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}" @click="addDaily">
        <span class="icon icon-pen"></span>
        <span class="txt">添加日记</span>
      </div>
    </div>
    <div class="match-daily-list-wrap" ref="matchDailyWrap">
      <ul class="match-daily-list">
        <li v-for="daily in matchDailys" class="match-daily-item" :class="{'male-theme': daily.sex === '1', 'female-theme': daily.sex === '0'}" @click="enterDailyDetail($event, daily.id)">
          <div class="date-time">
            <div class="date">{{daily.publicTime | translateDate}}</div>
            <div class="day">星期{{daily.publicTime | translateWeek}}</div>
          </div>
          <div class="daily-main">
            <div class="header">
              <div class="time">{{daily.publicTime | translateTime}}</div>
              <div class="mood-weather" v-show="daily.mood !== -1 && daily.weather !== -1">
                <span class="mood" :class="outputMoodClass(daily.mood)"></span>
                <span class="weather" :class="outputWeatherClass(daily.weather)"></span>
              </div>
            </div>
            <div class="daily-title">{{daily.title}}</div>
            <div class="daily-txt">{{daily.content}}</div>
          </div>
        </li>
      </ul>
    </div>
    <daily-detail-dialog :detail-data="dailyDetail" :detail-dialog-show="detailDialogShow" @detail-dialog-close="detailDialogClose" @daily-modify="modifyDaily"></daily-detail-dialog>
    <daily-notepad :all-data="notepadData" :notepad-show="notepadShow" @notepad-close="notepadClose"></daily-notepad>
  </div>
</template>

<script type="text/ecmascript-6">
  import {formateDate} from 'common/js/formateDate.js';
  import BetScroll from 'better-scroll';
  import dailyDetailDialog from 'components/dailyDetailDialog/dailyDetailDialog.vue';
  import dailyNotepad from 'components/dailyNotePad/dailynotepad.vue';

  export default {
    data: function() {
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
    mounted: function() {
      this.$nextTick(() => {
        if(!this.scroll) {
          this.scroll = new BetScroll(this.$refs.matchDailyWrap, {
            click: true
          });
        }else {
          this.scroll.refresh();
        }
      });
    },
    components: {
      'daily-detail-dialog': dailyDetailDialog,
      'daily-notepad': dailyNotepad
    },
    methods: {
      rewardDate: function() {
        let date = new Date(this.curDate);
        this.curDate = date.setDate(date.getDate() - 1);

        this.$nextTick(() => {
          if(!this.scroll) {
            this.scroll = new BetScroll(this.$refs.matchDailyWrap, {
              click: true
            });
          }else {
            this.scroll.refresh();
          }
        });
      },
      nextDate: function() {
        let date = new Date(this.curDate);
        this.curDate = date.setDate(date.getDate() + 1);
        this.$nextTick(() => {
          if(!this.scroll) {
            this.scroll = new BetScroll(this.$refs.matchDailyWrap, {
              click: true
            });
          }else {
            this.scroll.refresh();
          }
        });
      },
      outputMoodClass: function(moodType) {
        let type = parseInt(moodType);
        if(type !== -1) {
          let moodClassList = ['icon-mood-happy', 'icon-mood-normal', 'icon-mood-sadness'];
          return moodClassList[type];
        }
      },
      outputWeatherClass: function(weatherType) {
        let type = parseInt(weatherType);
        if(type !== -1) {
          let weatherClassList = ['icon-weather-sunny', 'icon-weather-cloudy', 'icon-weather-rainny', 'icon-weather-snowly'];
          return weatherClassList[type];
        }
      },
      addDaily: function() {
        this.notepadData = {
          editType: 0,
          curTime: new Date(),
          userSex: parseInt(this.userData.info.sex),
          title: '',
          content: '',
          moodType: -1,
          weatherType: -1
        };
        this.notepadShow = true;
      },
      enterDailyDetail: function(event, key) {
        if(event._constructed) {
          let data = this.userData.daily[key];
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
        };
      },
      detailDialogClose: function() {
        this.detailDialogShow = false;
      },
      modifyDaily: function(dailyId) {
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
      notepadClose: function() {
        this.notepadShow = false;
        this.detailDialogShow = false;
      }
    },
    computed: {
      userData: function() {
        return this.$store.state.userData;
      },
      matchDailys: function() {
        let curDateStr = formateDate(this.curDate, 'yyyy-MM-dd');
        let resultList = [];

        for(let key in this.userData.daily) {
          let tempArr = this.userData.daily[key].publicTime.split(' ');
          let tempItem = tempArr[0];
          if(tempItem === curDateStr) {
            resultList.push(this.userData.daily[key]);
          }
        }
        return resultList;
      },
      isToday: function() {
        let todayStr = formateDate(new Date().getTime(), 'yyyy-MM-dd');
        let curDateStr = formateDate(this.curDate, 'yyyy-MM-dd');
        return todayStr === curDateStr;
      }
    },
    filters: {
      translateMonth: function(val) {
        let date = new Date(val);
        let month = date.getMonth();
        let monthChar = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        return monthChar[month];
      },
      translateDate: function(val) {
        let date = new Date(val);
        let d = date.getDate();
        return d;
      },
      translateWeek: function(val) {
        let date = new Date(val);
        let week = date.getDay();
        let weekChar = ['日', '一', '二', '三', '四', '五', '六'];
        return weekChar[week];
      },
      translateTime: function(val) {
        return formateDate(val, 'hh:mm');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

  .calendar-wrapper
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
      width: 90%
      height: 80px
      line-height: 80px
      margin: 10px auto 0 auto
      text-align: center
      background-color: #fff
      border-radius: 5px
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
      width: 100%
      height: 300px
      overflow: hidden
      .match-daily-list
        padding-bottom: 20px
        .match-daily-item
          display: flex
          width: 90%
          height: 70px
          margin: 10px auto 0 auto
          padding: 10px
          border-radius: 5px
          background-color: #fff
          &.male-theme
            color: $male-color
          &.female-theme
            color: $female-color
          .date-time
            flex: 50px 0 0
            margin-right: 12px
            .date
              line-height: 40px
              font-size: $font-size-large-X
              text-align: center
            .day
              font-size: $font-size-middle
              text-align: center
          .daily-main
            flex: 1
            width: 80%
            .header
              width: 100%
              display: flex
              .time
                flex: 1
                font-size: $font-size-middle
              .mood-weather
                flex: 1
                text-align: right
                font-size: $font-size-middle
            .daily-title
              width: 100%
              font-size: $font-size-large
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
            .daily-txt
              width: 100%
              font-size: $font-size-middle
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
</style>
