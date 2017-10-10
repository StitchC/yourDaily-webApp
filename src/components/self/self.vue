<template>
  <div class="self-wrapper">
    <div class="user-detail" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}">
      <div class="user-detail-main">
        <div class="avatar-wrap">
          <img :src="avatar">
        </div>
        <div class="detail-content">
          <p class="user-name">{{userData.info.username}}</p>
          <p class="user-motto">{{userData.info.motto}}</p>
        </div>
      </div>
      <div class="edit-user-info-wrap" @click="showModifyInfo">
        <span class="icon-edit"></span>
        修改
      </div>
    </div>
    <div class="user-info">
      <div class="daily-count">
        <p>{{userData.info.count}}</p>
        <p>篇</p>
      </div>
      <div class="word-count">
        <p>{{userData.info.words}}</p>
        <p>字</p>
      </div>
      <div class="photo-count">
        <p>{{userData.info.images.length}}</p>
        <p>图</p>
      </div>
    </div>
    <div class="gallary-wrap" ref="gallaryWrap">
      <div class="gallary">
        <div class="image-item" v-for="(image, index) in userData.info.images">
          <div class="inner-img-wrap">
            <img :src="image" @click="imageSwiperShow($event, index)">
          </div>
        </div>
      </div>
    </div>
    <modify-user-info :modify-info-show="toggleModifyInfo" :user-data="userData" @modify-info-close="closeModifyInfo"></modify-user-info>
    <transition name="swiper-fade">
      <div class="mySwipe-wrap" v-show="swipeWrapShow">
        <swiper :options="swipeOption" ref="mySwiper">
          <swiper-slide v-for="(image, index) in userData.info.images" :key="index">
            <img :src="image" @click="imageWipeHide">
          </swiper-slide>
        </swiper>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import modifyUserInfo from 'components/modifyUserInfo/modifyUserInfo.vue';
  import BetScroll from 'better-scroll';
  import {swiper, swiperSlide} from 'vue-awesome-swiper';

  export default {
    data: function() {
      return {
        toggleModifyInfo: false,
        swipeWrapShow: false,
        swipeOption: {
          autoplay: 0,
          direction: 'horizontal',
          setWrapperSize: true
        }
      };
    },
    mounted: function() {
      this.$nextTick(() => {
        if(!this.scroll) {
          this.scroll = new BetScroll(this.$refs.gallaryWrap, {
            click: true
          });
        }else {
          this.scroll.refresh();
        }
      });
    },
    components: {
      'modify-user-info': modifyUserInfo,
      'swiper': swiper,
      'swiper-slide': swiperSlide
    },
    methods: {
      closeModifyInfo: function() {
        this.toggleModifyInfo = false;
      },
      showModifyInfo: function() {
        this.toggleModifyInfo = true;
      },
      imageSwiperShow: function(event, index) {
        this.$refs.mySwiper.swiper.slideTo(index, 300, false);
        this.swipeWrapShow = true;
      },
      imageWipeHide: function() {
        this.swipeWrapShow = false;
      }
    },
    computed: {
      userData: function() {
        this.$nextTick(() => {
          if(!this.scroll) {
            this.scroll = new BetScroll(this.$refs.gallaryWrap, {
              click: true
            });
          }else {
            this.scroll.refresh();
          }
        });
        return this.$store.state.userData;
      },
      avatar: function() {
        if(this.userData.info.avatar === '') {
          if(this.userData.info.sex === '1') {
            return '/static/images/male-avatar.jpg';
          }else {
            return '/static/images/female-avatar.jpg';
          }
        }else {
          return this.userData.info.avatar;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
        background-color: #4889B4
      &.female-theme
        background-color: #FE706F
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
          font-size: 14px
          .user-name
            line-height: 50px
            font-size: 16px
            color: #fff
          .user-motto
            font-size: 12px
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
        font-size: 14px
        color: #6A6B6A
      .word-count
        flex: 1
        line-height: 20px
        padding-top: 10px
        border-right: 1px solid #ccc
        text-align: center
        font-size: 14px
        color: #6A6B6A
      .photo-count
        flex: 1
        line-height: 20px
        padding-top: 10px
        text-align: center
        font-size: 14px
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
    .mySwipe-wrap
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      background-color: rgba(0,0,0,0.8)
      z-index: 50
      &.swiper-fade-enter
        opacity: 0
      &.swiper-fade-enter-active
        transition: all .4s linear
      &.swiper-fade-enter-to
        opacity: 1
      &.swiper-fade-leave-to
        opacity: 0
      &.swiper-fade-leave-active
        transition: all .4s linear
      .swiper-container
          height: 100%
        .swiper-wrapper
          display: flex
          align-items: center
          height: 100%
          .swiper-slide
            img
              width: 100%


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
              font-size: 14px
            .user-motto
              font-size: 12px
              line-height: 10px
      .edit-user-info-wrap
          width: 50px !important
          font-size: 12px
</style>
