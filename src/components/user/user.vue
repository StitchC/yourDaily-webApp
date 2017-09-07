<template>
  <transition name="user-fade">
    <div class="user-wrapper" :class="{'male-theme': userSex === 1, 'female-theme': userSex === 0}">
      <div class="user-header">
        <div class="user-tool-bar">
          <div class="setting-icon icon-setting"></div>
          <div class="user-nav">
            <router-link to="/user/daily" class="nav-item">日记</router-link>
            <router-link to="/user/calendar" class="nav-item">日历</router-link>
            <router-link to="/user/self" class="nav-item">我</router-link>
          </div>
          <div class="worm-hold">
            <img src="./sex-double.png">
          </div>
        </div>
        <p class="user-title">日记</p>
      </div>
      <div class="user-main">
        <router-view></router-view>
      </div>
      <select-sex :select-show="selectSexShow" :user-id="userId" @selectsex-confirm="confirmSex"></select-sex>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import selectsex from 'components/selectSex/selectsex.vue';
  import {getLocalStorage} from 'common/js/localStorage.js';

  const SEX_NOTINIT = 2;

  export default {
    data: function() {
      return {
        userId: '',
        userSex: -1,
        userData: null,
        selectSexShow: false
      };
    },
    created: function() {
      let data = getLocalStorage('ohMyDaily');
      let user = JSON.parse(data.userData);
      this.userSex = parseInt(user.sex);
      this.userId = user.id;

      if(this.userSex === SEX_NOTINIT) {
        this.selectSexShow = true;
      }else {
        // 发送ajax 请求获取数据
        this.$router.push('/user/daily');
      }
    },
    components: {
      'select-sex': selectsex
    },
    methods: {
      confirmSex: function(sex) {
        this.userSex = sex;
        this.$router.push('/user/daily');
        // 发送ajax 请求获取数据
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user-wrapper
    width: 100%
    height: 100%
    &.user-fade-enter
      opacity: 0
    &.user-fade-enter-active
      transition: all .3s linear
    &.user-fade-enter-to
      opacity: 1
    &.male-theme
      background-image: url("./male-bg.png")
      background-size: cover
      background-repeat: no-repeat
      .user-header
        .user-nav
          display: flex
          flex: 270px 0 0
          border: 1px solid #4889B4
          border-radius: 5px
          .nav-item
            border-right: 1px solid #4889B4
            color: #4889B4
            &:last-child
              width: 33%
              border-right: 0
            &.router-link-active
              color: #fff
              background-color: #4889B4
        .setting-icon
          color: #4889B4
      .user-title
        color: #4889B4
    &.female-theme
      background-image: url("./female-bg.jpg")
      background-size: cover
      background-repeat: no-repeat
      .user-header
        .user-nav
          display: flex
          flex: 270px 0 0
          border: 1px solid #FE706F
          border-radius: 5px
          .nav-item
            border-right: 1px solid #FE706F
            color: #FE706F
            &:last-child
              width: 33%
              border-right: 0
            &.router-link-active
              color: #fff
              background-color: #FE706F
        .setting-icon
          color: #FE706F
      .user-title
        color: #FE706F
    .user-header
      position: fixed
      width: 100%
      height: 100px
      top: 0
      left: 0
      background-color: #EFF0EF
      .user-tool-bar
        display: flex
        height: 30px
        margin-top: 35px
        .user-nav
          flex: 270px 0 0
          width: 270px
          height: 30px
          margin: 0 auto
          font-size: 0
          .nav-item
            display: inline-block
            width: 90px
            height: 30px
            line-height: 30px
            text-align: center
            font-size: 14px
        .setting-icon
          flex: 1
          width: 30px
          height: 30px
          line-height: 30px
          padding-right: 10px
          text-align: right
          font-size: 18px
        .worm-hold
          flex: 1
          width: 30px
          height: 30px
          line-height: 30px
          padding-left: 10px
          font-size: 0
          img
            width: 20px
            height: 20px
            vertical-align: middle
      .user-title
        margin-top: 10px
        font-size: 16px
        text-align: center
    .user-main
      width: 100%
      height: 100%
      padding-top: 150px

  @media screen and (max-width: 320px)
    .user-nav
      flex: 240px 0 0 !important
</style>
