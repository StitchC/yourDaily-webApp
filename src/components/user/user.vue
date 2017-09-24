<template>
  <transition name="user-fade">
    <div class="user-wrapper" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}">
      <div class="user-header">
        <div class="user-tool-bar">
          <div class="setting-icon icon-setting"></div>
          <div class="user-nav">
            <router-link to="/user/daily" class="nav-item">浏览</router-link>
            <router-link to="/user/calendar" class="nav-item">日历</router-link>
            <router-link to="/user/self" class="nav-item">我</router-link>
          </div>
          <div class="worm-hold">
            <img src="./sex-double.png">
          </div>
        </div>
        <p class="user-title" v-show="headerTitleShow">日记</p>
      </div>
      <div class="user-main">
        <router-view></router-view>
      </div>
      <select-sex :select-show="selectSexShow" :user-id="userId" @select-complete="confirmSex"></select-sex>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import selectsex from 'components/selectSex/selectsex.vue';
  import {getLocalStorage} from 'common/js/localStorage.js';

  /**
   * user 组件
   * 登录跳转到这个组件的时候或通过 localStorage 获取用户的性别及id
   * 根据性别的数字对user 界面的头部（导航栏）进行初始化风格
   * 实现不同用户不同风格
   *
   * 请求数据有两个分支
   * 分支一：
   *    如果性别为 2 即用户是新注册的用户没有初始化性别
   *    弹出性别的选择框让用户选择性别
   *    当用户确认修改性别后会触发 selectsex-confirm 事件
   *    事件调用 confirmSex 方法 此方法会发送ajax 请求后台获取用户的所有关联的数据
   *    然后初始化user 组件下的 daily， calendar， self 各个组件的数据
   *    最后跳转到 /user/daily 组件下
   *
   * 分支二：
   *    如果性别不为2 即用户不是新注册用户
   *    在created 生命周期钩子中发送ajax 请求用户所有关联的数据
   *    然后初始化user 组件下的 daily， calendar， self 各个组件的数据
   *    最后跳转到 /user/daily 组件下
   */
  const SEX_NOTINIT = 2;

  export default {
    data: function() {
      return {
        userId: '',
        userSex: -1,
        userAllData: null,
        userConnectId: '',
        headerTitleShow: true
      };
    },
    created: function() {
      let data = getLocalStorage('ohMyDaily');
      let user = JSON.parse(data.userData);
      this.userId = user.id;
      this.userConnectId = user.connect;
      // 发送ajax 请求获取数据
      this.$http.get('/yourdaily/php/user/getUserData.php', {
        params: {
          id: this.userId,
          connectId: this.userConnectId
        }
      }).then(res => {
        this.$store.commit('updateData', res.body);
        let userSex = parseInt(this.$store.state.userData.info.sex);
        if(userSex === SEX_NOTINIT) {
          this.$store.commit('toggleSelectSex', true);
        }else {
          this.$nextTick(() => {
            this.$router.push('/user/daily');
          });
        }
      });
    },
    components: {
      'select-sex': selectsex
    },
    methods: {
      confirmSex: function() {
        // 选择完性别之后发送ajax 更新 vuex 数据
        this.$http.get('/yourdaily/php/user/getUserData.php', {
          params: {
            id: this.userId,
            connectId: this.userConnectId
          }
        }).then(res => {
          this.$store.commit('updateData', res.body);
          this.$store.commit('toggleSelectSex', false);
          this.$nextTick(() => {
            this.$router.push('/user/daily');
          });
        });
      }
    },
    watch: {
      $route: function(val) {
        if(val.fullPath === '/user/calendar' || val.fullPath === '/user/self') {
          this.headerTitleShow = false;
        }else {
          this.headerTitleShow = true;
        }
      }
    },
    computed: {
      userData: function() {
        console.log(this.$store.state.userData);
        return this.$store.state.userData;
      },
      selectSexShow: function() {
        return this.$store.state.selectSexShow;
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
      z-index:50
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
  @media screen and (max-width: 320px)
    .user-nav
      flex: 240px 0 0 !important
</style>
