<template>
  <div class="calendar-wrapper">
    <div class="calendar-main" :class="{'male-theme': userSex === 1, 'female-theme': userSex === 0}">
      <div class="reward-btn icon-arrow-left" @click="rewardDate"></div>
      <div class="date-txt">
        <p class="month">{{curDate | translateMonth}}月</p>
        <p class="date">{{curDate | translateDate}}</p>
        <p class="week">星期{{curDate | translateWeek}}</p>
      </div>
      <div class="next-btn icon-arrow-right" @click="nextDate"></div>
    </div>
    <div class="no-match-daily-hint" v-show="matchDailys.length === 0">
      <div class="hint-content" :class="{'male-theme': userSex === 1, 'female-theme': userSex === 0}">
        <span class="icon icon-pen"></span>
        <span class="txt">添加日记</span>
      </div>
    </div>
    <div class="match-daily-list-wrap" ref="matchDailyWrap">
      <ul class="match-daily-list">
        <li v-for="daily in matchDailys" class="match-daily-item" :class="{'male-theme': daily.sex === '1', 'female-theme': daily.sex === '0'}">
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
  </div>
</template>

<script type="text/ecmascript-6">
  import {getLocalStorage} from 'common/js/localStorage.js';
  import {formateDate} from 'common/js/formateDate.js';
  import BetScroll from 'better-scroll';


  export default {
    data: function() {
      return {
        userSex: -1,
        curDate: new Date().getTime(),
        scroll: null
      };
    },
    created: function() {
      let data = getLocalStorage('ohMyDaily');
      let user = JSON.parse(data.userData);
      this.userSex = parseInt(user.sex);
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
    props: {
      userData: {
        type: Object
      }
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
      }
    },
    computed: {
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
  .calendar-wrapper
    width: 100%
    height: 100%
    overflow: hidden
    .calendar-main
      position: relative
      width: 100%
      padding-top: 100%
      background-color: #fff
      &.male-theme
        .reward-btn,
        .next-btn,
        .date-txt
          color: #4889B4
      &.female-theme
        .reward-btn,
        .next-btn,
        .date-txt
          color: #FE706F
      .reward-btn
        position: absolute
        display: inline-block
        top: 50%
        left: 12px
        width: 40px
        height: 120px
        line-height: 120px
        font-size: 24px
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
        font-size: 24px
        font-weight: bold
        z-index: 20
      .date-txt
        position: absolute
        display: inline-block
        top: 40%
        width: 100%
        text-align: center
        .month
          font-size: 24px
        .date
          font-size: 96px
        .week
          font-size: 20px
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
          font-size: 18px
        &.male-theme
          .icon
            background-color: #4889B4
          .txt
            color: #4889B4
        &.female-theme
          .icon
            background-color: #FE706F
          .txt
            color: #FE706F
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
            color: #4889B4
          &.female-theme
            color: #FE706F
          .date-time
            flex: 50px 0 0
            margin-right: 12px
            .date
              line-height: 40px
              font-size: 25px
              text-align: center
            .day
              font-size: 14px
              text-align: center
          .daily-main
            flex: 1
            width: 80%
            .header
              width: 100%
              display: flex
              .time
                flex: 1
                font-size: 14px
              .mood-weather
                flex: 1
                text-align: right
                font-size: 15px
            .daily-title
              width: 100%
              font-size: 16px
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
            .daily-txt
              width: 100%
              font-size: 14px
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
</style>
