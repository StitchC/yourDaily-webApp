<template>
  <transition name="user-fade">
    <div class="user-wrapper" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}">
      <div class="user-header">
        <div class="user-tool-bar">
          <div class="setting-icon icon-setting" @click="showSetting"></div>
          <div class="user-nav">
            <router-link to="/user/daily" class="nav-item">浏览</router-link>
            <router-link to="/user/calendar" class="nav-item">日历</router-link>
            <router-link to="/user/self" class="nav-item">我</router-link>
          </div>
          <div class="worm-hold">
            <img src="./sex-double.png">
          </div>
        </div>
      </div>
      <div class="user-main">
        <router-view></router-view>
      </div>
      <select-sex :select-show="selectSexShow" :user-id="userId" @select-complete="confirmSex"></select-sex>
      <user-setting :show="settingShow" @hide-setting="settingHide"></user-setting>
      <daily-lock :show="dailyLockShow" :status="1" @daily-lock-success="dailyLockSuccess"></daily-lock>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import selectsex from 'components/selectSex/selectsex.vue';
  import userSetting from 'components/setting/setting.vue';
  import dailyLock from 'components/dailyLock/dailyLock.vue';
  import {getUserDefaultData, getUserDailyLock} from 'common/js/localStorage.js';

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
   *    更新 vuex 里的共享数据
   *    最后跳转到 /user/daily 组件下
   *
   * 分支二：
   *    如果性别不为2 即用户不是新注册用户
   *    在created 生命周期钩子中发送ajax 请求用户所有关联的数据
   *    然后更新 vuex 里的共享数据
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
        headerTitleShow: true,
        settingShow: false,
        dailyLockShow: false
      };
    },
    created: function() {
      let user = getUserDefaultData();
      this.userId = user.id;
      this.userConnectId = user.connect;
      let dailyLock = getUserDailyLock(user.id);
      // 如果用户有设置到日记锁并且日记锁为启用状态 显示解锁界面
      if(dailyLock && dailyLock.lockStatus === true) {
        this.dailyLockShow = true;
      }
      // 组件加载时发送ajax 请求获取数据
      this.$http.get('/yourdaily/php/user/getUserData.php', {
        params: {
          id: this.userId,
          connectId: this.userConnectId
        }
      }).then(res => {
        this.$store.commit('updateData', res.body);
        let userSex = parseInt(this.$store.state.userData.info.sex);
        // 如果性别为2 表示未被初始化 需要显示性别选择组件
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
      'select-sex': selectsex,
      'user-setting': userSetting,
      'daily-lock': dailyLock
    },
    methods: {
      confirmSex: function() {
        // 选择完性别之后发送ajax 更新 vuex 数据
        this.$store.dispatch('requestNewData', {
          id: this.userId,
          connectId: this.userConnectId
        }).then(() => {
          // 更新数据完毕后关闭性别选择组件
          this.$store.commit('toggleSelectSex', false);
          this.$nextTick(() => {
            this.$router.push('/user/daily');
          });
        });
      },
      settingHide: function() {
        this.settingShow = false;
      },
      showSetting: function() {
        this.settingShow = true;
      },
      dailyLockSuccess: function() {
        this.dailyLockShow = false;
      }
    },
    computed: {
      userData: function() {
        return this.$store.state.userData;
      },
      selectSexShow: function() {
        return this.$store.state.selectSexShow;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

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
          border: 1px solid $male-color
          border-radius: 5px
          .nav-item
            display: block
            flex: 1
            border-right: 1px solid $male-color
            font-size: $font-size-middle
            color: $male-color
            &:last-child
              border-right: 0
            &.router-link-active
              color: #fff
              background-color: $male-color
        .setting-icon
          color: $male-color
      .user-title
        color: $male-color
    &.female-theme
      background-image: url("./female-bg.jpg")
      background-size: cover
      background-repeat: no-repeat
      .user-header
        .user-nav
          display: flex
          flex: 270px 0 0
          border: 1px solid $female-color
          border-radius: 5px
          .nav-item
            border-right: 1px solid $female-color
            color: $female-color
            &:last-child
              width: 33%
              border-right: 0
            &.router-link-active
              color: #fff
              background-color: $female-color
        .setting-icon
          color: $female-color
      .user-title
        color: $female-color
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
        height: 40px
        justify-content: space-between
        align-items: center
        margin-top: 35px
        .user-nav
          display: flex
          flex: 3
          height: 30px
          margin: 0 auto
          .nav-item
            flex: 1
            height: 30px
            line-height: 30px
            text-align: center
            font-size: $font-size-middle
        .setting-icon
          flex: 1
          width: 30px
          height: 30px
          line-height: 30px
          font-size: 18px
          text-align: center
        .worm-hold
          flex: 1
          width: 30px
          height: 30px
          line-height: 30px
          font-size: 0
          text-align: center
          img
            width: 20px
            height: 20px
            vertical-align: middle
    .user-main
      width: 100%
      height: 100%
  @media screen and (max-width: 320px)
    .user-nav
      flex: 240px 0 0 !important
</style>
