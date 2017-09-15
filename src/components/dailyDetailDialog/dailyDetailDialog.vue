<template>
  <transition name="detail-dialog-fade">
    <div class="detail-dialog-wrapper" v-show="show">
      <div class="dialog-main">
        <div class="header" :class="{'male-theme': detailData.sex === 1, 'female-theme': detailData.sex === 0}">
          <div class="close-btn icon-close" @click="closeDialog"></div>
          <p class="year-month">{{detailData.time | translateYear}}年，{{detailData.time | translateMonth}}月</p>
          <p class="date">{{detailData.time | translateDate}}</p>
          <p class="week-time">星期{{detailData.time | translateWeek}} {{detailData.time | translateTime}}</p>
        </div>
        <div class="content">
          <p class="title" v-show="detailData.title !== ''">{{detailData.title}}</p>
          <p class="txt">{{detailData.content}}</p>
        </div>
        <div class="footer" :class="{'male-theme': detailData.sex === 1, 'female-theme': detailData.sex === 0}">
          <div class="delete-btn icon-delete" v-show="selfDaily()" @click="deleteDaily(detailData.dailyId)"></div>
          <div class="edit-btn icon-edit" v-show="selfDaily()" @click="editDaily(detailData.dailyId)"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {formateDate} from 'common/js/formateDate.js';
  import {getLocalStorage} from 'common/js/localStorage.js';

  export default {
    data: function() {
      return {
        show: this.detailDialogShow,
        detail: this.detailData
      };
    },
    props: {
      detailData: {
        type: Object
      },
      detailDialogShow: {
        type: Boolean
      }
    },
    watch: {
      detailDialogShow: function(val) {
        this.show = val;
      }
    },
    methods: {
      closeDialog: function() {
        this.$emit('detail-dialog-close');
      },
      selfDaily: function() {
        let data = getLocalStorage('ohMyDaily');
        let user = JSON.parse(data.userData);

        let curDailyUserId = this.detailData.userId;
        let curLoginUserId = user.id;

        if(curDailyUserId === curLoginUserId) {
          return true;
        }else {
          return false;
        }
      }
    },
    filters: {
      translateYear: function(val) {
        let date = new Date(val);
        console.log(val);
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
    &.detail-dialog-fade-enter
      opacity: 0
    &.detail-dialog-fade-enter-active
      transition: all .5s ease
    &.detail-dialog-fade-enter-to
      opacity: 1
    &.detail-dialog-fade-leave-active
      transition: all .5s ease
    &.detail-dialog-fade-leave-to
      opacity: 0
    .dialog-main
      position: absolute
      top: 50%
      left: 50%
      margin: -320px auto 0 -170px
      width: 340px
      height: 640px
      .header
        position: relative
        width: 100%
        height: 200px
        padding-top: 24px
        border-top-left-radius: 20px
        border-top-right-radius: 20px
        &.male-theme
          background-color: #4889B4
        &.female-theme
          background-color: #FE706F
        .close-btn
          position: absolute
          top: 24px
          right: 12px
          font-size: 24px
          color: #fff
        .year-month
          font-size: 14px
          text-align: center
          color: #fff
        .date
          margin-top: 24px
          font-size: 56px
          text-align: center
          color: #fff
        .week-time
          margin-top: 16px
          font-size: 14px
          text-align: center
          color: #fff
      .content
        height: 320px
        padding: 24px
        background-color: #fff
        .title
          line-height: 38px
        .txt
          line-height: 30px
      .footer
        position: relative
        width: 100%
        height: 50px
        border-bottom-left-radius: 20px
        border-bottom-right-radius: 20px
        &.male-theme
          background-color: #4889B4
        &.female-theme
          background-color: #FE706F
        .delete-btn
          position: absolute
          left: 24px
          display: inline-block
          height: 50px
          line-height: 50px
          font-size: 25px
          color: #fff
        .edit-btn
          position: absolute
          display: inline-block
          right: 24px
          height: 50px
          line-height: 50px
          font-size: 25px
          color: #fff

  @media screen and (max-width: 320px)
    .detail-dialog-wrapper
      .dialog-main
        top: 50%
        left: 50%
        margin: -250px auto 0 -140px
        width: 280px
        height: 500px
        .header
          width: 100%
          height: 180px
          padding-top: 20px
          .close-btn
            top: 18px
        .content
          height: 230px
          padding: 24px
        .footer
          height: 40px
          .delete-btn
            height: 40px
            line-height: 40px
            font-size: 20px
            color: #fff
          .edit-btn
            right: 24px
            height: 40px
            line-height: 40px
            font-size: 20px
            color: #fff
</style>
