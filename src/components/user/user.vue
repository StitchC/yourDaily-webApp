<template>
  <transition name="user-fade">
    <div class="user-wrapper" :class="{'male-theme': userSex === 1, 'female-theme': userSex === 0}">
      <div class="user-header">
        <div class="user-tool-bar">
          <div class="setting-icon"></div>
          <div class="user-nav">
            <router-link to="/user/daily" class="nav-item">日记</router-link>
            <router-link to="/user/calendar" class="nav-item">日历</router-link>
            <router-link to="/user/self" class="nav-item">我</router-link>
          </div>
          <div class="worm-hold"></div>
        </div>
        <p class="user-title">日记</p>
      </div>
      <div class="user-main">
        <router-view></router-view>
      </div>
      <select-sex :select-show="selectSexShow" :user-id="userId" @selectsex-confirm="confitmSex"></select-sex>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import selectsex from 'components/selectSex/selectsex.vue';

  export default {
    data: function() {
      return {
        selectSexShow: false,
        userId: this.$route.params.userId,
        userSex: this.$route.params.userSex
      };
    },
    created: function() {
      // 如果性别代码为2 表示刚注册用户 需要显示性别选择页供用户选择性别才能进入
      if(parseInt(this.userSex) === 2) {
        this.selectSexShow = true;
      }
    },
    components: {
      'select-sex': selectsex
    },
    methods: {
      confitmSex: function(sex) {
        this.userSex = sex;
        console.log(this.userSex);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user-wrapper
    &.user-fade-enter
      opacity: 0
    &.user-fade-enter-active
      transition: all .3s linear
    &.user-fade-enter-to
      opacity: 1
    .user-header
      position: fixed
      width: 100%
      height: 120px
      top: 0
      left: 0
      background-color: #EFF0EF
      .user-tool-bar
        display: flex
        height: 30px
        margin-top: 45px
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
        .worm-hold
          flex: 1
          width: 30px
          height: 30px
      .user-title
        margin-top: 10px
        font-size: 17px
        text-align: center
</style>
