<template>
  <transition name="detail-dialog-fade">
    <div class="detail-dialog-wrapper" v-show="show">
      <div class="detail-dialog-main">
        <div class="header" :class="{'male-theme': detailData.sex === 1, 'female-theme': detailData.sex === 0}">
          <div class="close-btn icon-close" @click="closeDialog"></div>
          <p class="year-month">{{detailData.time | translateYear}}年，{{detailData.time | translateMonth}}月</p>
          <p class="date">{{detailData.time | translateDate}}</p>
          <p class="week-time">星期{{detailData.time | translateWeek}} {{detailData.time | translateTime}}</p>
        </div>
        <div class="content-scroll" ref="contentScroll">
          <div class="content">
            <p class="title" v-show="detailData.title !== ''">{{detailData.title}}</p>
            <p class="txt">{{detailData.content}}</p>
            <ul class="daily-image-list">
              <li v-for="(item, index) in detailData.images" class="image-item">
                <img @click="viewPhoto($event, index)" v-lazy="item">
              </li>
            </ul>
          </div>
        </div>
        <div class="footer" :class="{'male-theme': detailData.sex === 1, 'female-theme': detailData.sex === 0}">
          <div class="delete-btn icon-delete" v-show="selfDaily()" @click="deleteDaily"></div>
        </div>
      </div>
      <select-dialog :show="selectDialogShow" :txt="selectDialogTxt" @cancel="selectDialogCancel" @confirm="selectDialogConfirm"></select-dialog>
      <photo-preview-list :images-list="detailData.images" :show="photoListShow" :images-show-index="photoListShowIndex" @photo-preview-list-hide="photoPreviewHide"></photo-preview-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /**
   * 日记详情组件
   * 参数：
   * detailData （日记的数据）
   * 格式：
   * {
        dailyId: detail.id,
        time: detail.publicTime,
        title: detail.title,
        content: detail.content,
        userId: detail.userId,
        sex: parseInt(detail.sex),
        images: detail.images
      }
   *
   * detailDialogShow （组件显示或隐藏的状态切换）
   * true / false
   *
   * 触发事件：
   * detail-dialog-close：组件关闭按钮点击时通知父组件将其关闭
   * daily-has-delete：组件删除按钮点击时通知父组件
   * daily-modify：组件编辑按钮点击时通知父组件
   */
  import {formateDate} from 'common/js/formateDate.js';
  import selectDialog from 'components/selectDialog/selectdialog.vue';
  import photoPreviewList from 'components/photoPreviewList/photoPreviewList.vue';
  import BetScroll from 'better-scroll';

  const SUCCESS_CODE = 200;
  export default {
    data: function() {
      return {
        show: this.detailDialogShow,
        detail: this.detailData,
        selectDialogShow: false,
        selectDialogTxt: '',
        photoListShow: false,
        photoListShowIndex: 0
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
    mounted: function() {
      setTimeout(() => {
        if(!this.scroll) {
          this.scroll = new BetScroll(this.$refs.contentScroll, {
            click: true
          });
        }else {
          this.scroll.refresh();
        }
      }, 300);
    },
    watch: {
      detailDialogShow: function(val) {
        this.show = val;
      },
      detailData: function() {
        console.log('change');
        setTimeout(() => {
          if(!this.scroll) {
            this.scroll = new BetScroll(this.$refs.contentScroll, {
              click: true
            });
          }else {
            this.scroll.refresh();
          }
        }, 300);
      }
    },
    methods: {
      closeDialog: function() {
        this.$emit('detail-dialog-close');
      },
      selfDaily: function() {
        let curDailyUserId = this.detailData.userId;
        let curLoginUserId = this.$store.state.userData.info.id;

        if(curDailyUserId === curLoginUserId) {
          return true;
        }else {
          return false;
        }
      },
      deleteDaily: function() {
        this.selectDialogShow = true;
        this.selectDialogTxt = '确定要删除日记吗？删了将不会再恢复了';
      },
      selectDialogCancel: function() {
        this.selectDialogShow = false;
      },
      selectDialogConfirm: function() {
        this.$http.post('/yourdaily/php/user/deleteDaily.php', {
          id: this.detailData.dailyId
        }, {emulateJSON: true}).then(res => {
          let msg = res.body;
          if(msg.status === SUCCESS_CODE) {
            // 删除成功后发送ajax 请求更新 vuex 数据
            this.$store.dispatch('requestNewData', {
              id: this.userData.info.id,
              connectId: this.userData.info.connect
            }).then(() => {
              this.selectDialogShow = false;
              this.$emit('detail-dialog-close');
            });
          }
        });
      },
      photoPreviewHide: function() {
        this.photoListShow = false;
      },
      viewPhoto: function(evnet, index) {
        this.photoListShowIndex = index;
        this.photoListShow = true;
      }
    },
    components: {
      'select-dialog': selectDialog,
      'photo-preview-list': photoPreviewList
    },
    computed: {
      userData: function() {
        return this.$store.state.userData;
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
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0.5)
    z-index: 55
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
    .detail-dialog-main
      position: absolute
      top: 50%
      left: 50%
      margin-top: -280px
      margin-left: -170px
      width: 340px
      height: 560px
      .header
        position: relative
        width: 100%
        height: 180px
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
      .content-scroll
        height: 316px
        background-color: #fff
        overflow: hidden
        .content
          padding: 24px
          .title
            line-height: 38px
          .txt
            line-height: 30px
            font-size: 14px
          .daily-image-list
            .image-item
              img
                width: 100%
      .footer
        position: relative
        width: 100%
        height: 40px
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
          height: 40px
          line-height: 40px
          font-size: 25px
          color: #fff

  @media screen and (max-width: 320px)
    .detail-dialog-wrapper
      .detail-dialog-main
        top: 50%
        left: 50%
        margin-top: -240px
        margin-left: -140px
        width: 280px
        height: 480px
        .header
          width: 100%
          height: 180px
          padding-top: 20px
          .close-btn
            top: 18px
        .content-scroll
          height: 260px
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
