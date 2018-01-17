<template>
  <div class="self-wrapper">
    <div class="user-detail" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}">
      <div class="user-detail-main">
        <div class="avatar-wrap">
          <img :src="avatar">
        </div>
        <div class="detail-content">
          <p class="user-name">{{userInfo.username}}</p>
          <p class="user-motto">{{userInfo.motto}}</p>
        </div>
      </div>
      <div class="edit-user-info-wrap" @click="showModifyInfo">
        <span class="icon-edit"></span>
        修改
      </div>
    </div>
    <div class="user-info">
      <div class="daily-count">
        <p>{{userInfo.count}}</p>
        <p>篇</p>
      </div>
      <div class="word-count">
        <p>{{userInfo.words}}</p>
        <p>字</p>
      </div>
      <div class="photo-count">
        <p>{{userInfo.images.length}}</p>
        <p>图</p>
      </div>
    </div>
    <div class="gallary-wrap">
      <scroll-view :content="userInfo.images" ref="scroll">
        <div class="gallary">
          <div class="image-item" v-for="(image, index) in userInfo.images">
            <div class="inner-img-wrap">
              <img :src="image" @click="photoPreviewShow($event, index)">
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <modify-user-info :modify-info-show="toggleModifyInfo" :user-data="userInfo" @modify-info-close="closeModifyInfo"></modify-user-info>
    <photo-preview-list :images-list="userInfo.images" :show="photoListShow" :images-show-index="photoListShowIndex" @photo-preview-list-hide="photoPreviewHide"></photo-preview-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import modifyUserInfo from 'components/modifyUserInfo/modifyUserInfo.vue';
  import photoPreviewList from 'components/photoPreviewList/photoPreviewList.vue';
  import scrollView from 'base/scrollView/scrollView.vue';
  import {mapGetters} from 'vuex';


  export default {
    data() {
      return {
        toggleModifyInfo: false,
        swipeWrapShow: false,
        photoListShow: false,
        photoListShowIndex: 0
      };
    },
    components: {
      'modify-user-info': modifyUserInfo,
      'photo-preview-list': photoPreviewList,
      'scroll-view': scrollView
    },
    methods: {
      closeModifyInfo() {
        this.toggleModifyInfo = false;
      },
      showModifyInfo() {
        this.toggleModifyInfo = true;
      },
      photoPreviewShow(event, index) {
        this.photoListShowIndex = index;
        this.photoListShow = true;
      },
      photoPreviewHide() {
        this.photoListShow = false;
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'getInfo'
      }),
      avatar() {
        if(this.userInfo.avatar === '') {
          if(this.userInfo.sex === '1') {
            return '/static/images/male-avatar.jpg';
          }else {
            return '/static/images/female-avatar.jpg';
          }
        }else {
          return this.userInfo.avatar;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

  .self-wrapper
    width: 100%
    height: 100%
    padding-top: 100px
    background-color: #EFF0EF
    .user-detail
      position: relative
      width: 100%
      height: 120px
      padding-top: 1px
      &.male-theme
        background-color: $male-color
      &.female-theme
        background-color: $female-color
      .user-detail-main
        width: 100%
        height: 80px
        margin-top: 20px
        font-size: 0
        .avatar-wrap
          display: inline-block
          vertical-align: top
          width: 80px
          height: 80px
          line-height: 80px
          margin-left: 24px
          border-radius: 50%
          overflow: hidden
          img
            width: 100%
        .detail-content
          display: inline-block
          height: 80px
          margin-left: 12px
          font-size: $font-size-middle
          .user-name
            line-height: 50px
            font-size: 16px
            color: #fff
          .user-motto
            font-size: $font-size-small
            color: rgba(255,255,255,0.4)
      .edit-user-info-wrap
        position: absolute
        top: 50px
        right: 12px
        width: 60px
        height: 25px
        line-height: 25px
        border-radius: 5px
        border: 1px solid #fff
        color: #fff
        text-align: center
    .user-info
      display: flex
      width: 100%
      height: 60px
      background-color: #fff
      .daily-count
        flex: 1
        line-height: 20px
        padding-top: 10px
        border-right: 1px solid #ccc
        text-align: center
        font-size: $font-size-middle
        color: #6A6B6A
      .word-count
        flex: 1
        line-height: 20px
        padding-top: 10px
        border-right: 1px solid #ccc
        text-align: center
        font-size: $font-size-middle
        color: #6A6B6A
      .photo-count
        flex: 1
        line-height: 20px
        padding-top: 10px
        text-align: center
        font-size: $font-size-middle
        color: #6A6B6A
    .gallary-wrap
      position: absolute
      width: 100%
      top: 280px
      bottom: 0
      left: 0
      overflow: hidden
      .gallary
        display: flex
        flex-wrap: wrap
        flex-direction: row
        overflow: hidden
      .image-item
        flex: 0 0 33.33%
        .inner-img-wrap
          position: relative
          width: 100%
          height: 0
          padding-top: 100%
          overflow: hidden
          img
            position: absolute
            top: 0
            left: 0
            right: 0
            bottom: 0
            width: 100%
            margin: auto 0

  @media screen and (max-width: 320px)
    .self-wrapper
      .user-detail
        .user-detail-main
          .avatar-wrap
            width: 50px
            height: 50px
            margin-top: 15px
            margin-left: 12px
          .detail-content
            .user-name
              line-height: 50px
              font-size: $font-size-middle
            .user-motto
              font-size: $font-size-small
              line-height: 10px
      .edit-user-info-wrap
          width: 50px !important
          font-size: $font-size-small
</style>
