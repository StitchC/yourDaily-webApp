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
          <scroll-view :content="detailData" ref="scroll">
            <div>
              <div class="content">
                <p class="title" v-show="detailData.title !== ''">{{detailData.title}}</p>
                <p class="txt">{{detailData.content}}</p>
                <ul class="daily-image-list">
                  <li v-for="(item, index) in detailData.images" class="image-item" :key="index">
                    <img @click="viewPhoto($event, index)" @load="imgLoad" v-lazy="item">
                  </li>
                </ul>
              </div>
            </div>
          </scroll-view>
        </div>
        <div class="footer" :class="{'male-theme': detailData.sex === 1, 'female-theme': detailData.sex === 0}">
          <div class="delete-btn icon-delete" v-show="selfDaily()" @click="deleteDaily"></div>
        </div>
      </div>
      <select-dialog :show="selectDialogShow" :txt="selectDialogTxt" @cancel="selectDialogCancel" @confirm="selectDialogConfirm"></select-dialog>
      <photo-preview-list :images-list="detailData.images" :show="photoListShow" :images-show-index="photoListShowIndex" @photo-preview-list-hide="photoPreviewHide"></photo-preview-list>
      <loading :show="loadingShow"></loading>
      <hint-dialog :show="hintDialogShow" :hint-txt="hintTxt" :delay="800" @will-hide="hintWillHide"></hint-dialog>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /**
   * 日记详情组件
   *
   *
   * @param {Object} - detailData （日记的数据）
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
   * @param {Boolean} - detailDialogShow 组件显示或隐藏的状态切换
   *
   * 触发事件：
   * @event - detail-dialog-close   组件关闭按钮点击时通知父组件将其关闭
   * @event - daily-has-delete      组件删除按钮点击时通知父组件
   * @event - daily-modify          组件编辑按钮点击时通知父组件
   */

  import selectDialog from 'base/selectDialog/selectdialog.vue';
  import photoPreviewList from 'components/photoPreviewList/photoPreviewList.vue';
  import loading from 'base/loading/loading.vue';
  import hintDialog from 'base/hintDialog/hintDialog.vue';
  import {mapGetters, mapActions} from 'vuex';
  import {formateDate} from 'common/js/formateDate.js';
  import {deleteDaily} from 'api/allApi.js';
  import scrollView from 'base/scrollView/scrollView.vue';

  const SUCCESS_CODE = 200;
  export default {
    data() {
      return {
        show: this.detailDialogShow,
        selectDialogShow: false,
        selectDialogTxt: '',
        photoListShow: false,
        photoListShowIndex: 0,
        loadingShow: false,
        hintDialogShow: false,
        hintTxt: ''
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
        console.log(val);
      },
      detailData: function(val) {
          console.log(this.detail);
      }
    },
    methods: {
      ...mapActions([
        'reloadData'
      ]),
      _toggleLoading() {
        this.loadingShow = !this.loadingShow;
      },
      _toggleHintDialog(txt = '') {
        this.hintDialogShow = !this.hintDialogShow;
        this.hintTxt = txt;
      },
      hintWillHide(promise) {
        promise.then(() => {
          this._toggleHintDialog();
        });
      },
      closeDialog() {
        this.$emit('detail-dialog-close');
      },
      selfDaily() {
        // 此函数用作控制日记删除按钮的显示或隐藏
        // 用户id 会被保存到 localStorage 里面
        // 判断当前查看日记的用户是否为本人
        // 如果是本人 那么返回true 否则返回 false
        let curDailyUserId = this.detailData.userId;
        let curLoginUserId = this.userInfo.id;

        console.log(curDailyUserId, curLoginUserId);
        

        if(curDailyUserId === curLoginUserId) {
          return true;
        }else {
          return false;
        }
      },
      deleteDaily() {
        this.selectDialogShow = true;
        this.selectDialogTxt = '确定要删除日记吗？删了将不会再恢复了';
      },
      selectDialogCancel() {
        this.selectDialogShow = false;
      },
      selectDialogConfirm() {
        this._toggleLoading();
        deleteDaily({
          id: this.detailData.dailyId
        }).then(res => {
          let msg = res.data;
          if(msg.status === SUCCESS_CODE) {
            // 隐藏选择对话框
            this.selectDialogShow = false;
            this.$emit('detail-dialog-close');
            // 删除成功后发送ajax 请求更新 vuex 数据
            this.reloadData({
              id: this.userInfo.id,
              connectId: this.userInfo.connect
            }).then(() => {
              this._toggleLoading();
              // 显示提示框
              this._toggleHintDialog('删除成功');
            });
          }
        });
      },
      photoPreviewHide() {
        this.photoListShow = false;
      },
      viewPhoto(evnet, index) {
        this.photoListShowIndex = index;
        this.photoListShow = true;
      },
      imgLoad() {
        this.$refs.scroll.refresh();
      }
    },
    components: {
      'select-dialog': selectDialog,
      'photo-preview-list': photoPreviewList,
      'scroll-view': scrollView,
      'hint-dialog': hintDialog,
      loading
    },
    computed: {
      ...mapGetters({
        userInfo: 'getInfo'
      })
    },
    filters: {
      translateYear(val) {
        let date = new Date(val);
  
        return date.getFullYear();
      },
      translateMonth(val) {
        let date = new Date(val);
        let tempList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        let month = date.getMonth();
        return tempList[month];
      },
      translateDate(val) {
        return formateDate(val, 'dd');
      },
      translateWeek(val) {
        let tempList = ['日', '一', '二', '三', '四', '五', '六'];
        let date = new Date(val);
        let day = date.getDay();
        return tempList[day];
      },
      translateTime(val) {
        return formateDate(val, 'hh:mm');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

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
          background-color: $male-color
        &.female-theme
          background-color: $female-color
        .close-btn
          position: absolute
          top: 24px
          right: 12px
          font-size: $font-size-large-X
          color: #fff
        .year-month
          font-size: $font-size-middle
          text-align: center
          color: #fff
        .date
          margin-top: 24px
          font-size: 56px
          text-align: center
          color: #fff
        .week-time
          margin-top: 16px
          font-size: $font-size-middle
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
            font-size: $font-size-middle
            word-break: break-word
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
          background-color: $male-color
        &.female-theme
          background-color: $female-color
        .delete-btn
          position: absolute
          left: 24px
          display: inline-block
          height: 40px
          line-height: 40px
          font-size: $font-size-large-X
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
  @media screen and (max-height: 480px)
    // 兼容 iphone 4
    .detail-dialog-wrapper
      .detail-dialog-main
        .footer
          position: absolute
          bottom: 0
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
