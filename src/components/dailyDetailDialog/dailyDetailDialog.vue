<template>
  <transition name="detail-dialog-fade">
    <div class="detail-dialog-wrapper">
      <div class="dialog-main">
        <div class="header" :class="{'male-theme': detailData.sex === 1, 'female-theme': detailData.sex === 0}">
          <p class="year-month">{{detailData.publicTime | translateYear}}年，{{detailData.publicTime | translateMonth}}月</p>
          <p class="date">{{detailData.publicTime | translateDate}}</p>
          <p class="week-time">{{detailData.publicTime | translateWeek}}，{{detailData.publicTime | translateTime}}</p>
        </div>
        <div class="content">
          <p>{{detailData.title}}</p>
          <p>{{detailData.content}}</p>
        </div>
        <div class="footer" :class="{'male-theme': detailData.sex === 1, 'female-theme': detailData.sex === 0}"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {formateDate} from 'common/js/formateDate.js';

  export default {
    props: {
      detailData: {
        type: Object
      }
    },
    filters: {
      translateYear: function(val) {
        let date = new Date(val);
        return date.getFullYear();
      },
      translateMonth: function(val) {
        let date = new Date(val);
        let tempList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        let month = date.getMonth();
        return tempList[month];
      },
      translateDate: function(val) {
        return formateDate(val, 'dd');
      },
      translateWeek: function(val) {
        let tempList = ['日', '一', '二', '三', '四', '五', '六'];
        let date = new Date(val);
        let day = date.getDay();
        return tempList[day];
      },
      translateTime: function(val) {
        return formateDate(val, 'hh:mm');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .detail-dialog-wrapper
    position: fixed
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0.5)
    .dialog-main
      position: relative
      margin: 30px auto 20px auto
      width: 340px
      height: 90%
      border-radius: 10px
      background-color: #fff
      .header
        position: relative
        width: 100%
        height: 35%
        border-top-left-radius: 10px
        border-top-right-radius: 10px
        &.male-theme
          background-color: #4889B4
        &.female-theme
          background-color: #FE706F
      .content
        padding: 24px
      .footer
        position: absolute
        bottom: 0
        left: 0
        width: 100%
        height: 60px
        border-bottom-left-radius: 10px
        border-bottom-right-radius: 10px
        &.male-theme
          background-color: #4889B4
        &.female-theme
          background-color: #FE706F
</style>
