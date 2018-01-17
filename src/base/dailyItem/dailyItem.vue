<template>
  <li class="daily-item"
      :class="{'male-theme': daily.sex === '1', 'female-theme': daily.sex === '0'}"
      @click="enterDailyDetail($event, dailykey)">
    <div class="date-time">
      <div class="date">{{daily.publicTime | translateDate}}</div>
      <div class="day">{{daily.publicTime | translateDay}}</div>
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
</template>

<script type="text/ecmascript-6">
  /**
   * 日记列表项组件
   *
   * @param {Object} daily - 要输出日记的数据对象
   * @param {String} key - 当前输出日记的key
   * */

  import {formateDate} from 'common/js/formateDate.js';

  const weatherClassList = ['icon-weather-sunny', 'icon-weather-cloudy', 'icon-weather-rainny', 'icon-weather-snowly'];
  const moodClassList = ['icon-mood-happy', 'icon-mood-normal', 'icon-mood-sadness'];
    export default {
        props: {
          daily: {
            type: Object
          },
          dailykey: {
            type: String
          }
        },
        methods: {
          enterDailyDetail(event, key) {
            this.$emit('enter-dailydetail', key);
          },
          outputMoodClass(mood) {
            return moodClassList[mood];
          },
          outputWeatherClass(weather) {
            return weatherClassList[weather];
          }
        },
      filters: {
        translateDate(val) {
          let date = new Date(val);
          return date.getDate();
        },
        translateDay(val) {
          let date = new Date(val);
          let chinese = ['日', '一', '二', '三', '四', '五', '六'];
          let str = '星期' + chinese[date.getDay()];
          return str;
        },
        translateTime(val) {
          let date = new Date(val);
          let str = formateDate(date, 'hh:mm');
          return str;
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

  .daily-item
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
          font-size: $font-size-middle
        .mood-weather
          flex: 1
          text-align: right
          font-size: 15px
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
