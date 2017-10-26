<template>
  <transition name="setting-wrapper-slide">
    <div class="setting-wrapper" v-show="show">
      <div class="setting-header" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}">
        <span class="close-btn icon-close" @click="hide"></span>
        <h3 class="setting-title">设置</h3>
      </div>
      <div class="setting-main">
        <div class="daily-lock">
          <span>开启日记密码</span>
          <toggle-btn @toggle-btn-change="btnOnchange" :checked="toggleBtnChecked"></toggle-btn>
        </div>
        <div class="logout-btn" @click="logout">退出登录</div>
      </div>
      <daily-lock @daily-lock-hide="hideDailyLock" @daily-lock-setting-complete="completeSet" :show="dailyLockShow" :status="0"></daily-lock>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import toggleBtn from 'components/toggleBtn/toggleBtn.vue';
  import dailyLock from 'components/dailyLock/dailyLock.vue';
  import {setUserDailyLock, getUserDailyLock} from 'common/js/localStorage.js';
  /**
   *  用户设置组件
   *  参数:
   *    (boolean) show  控制组件显示 / 隐藏
   *  事件:
   *    hidden-setting: 触发父组件事件隐藏自身
   * */
  export default {
    data: function() {
      return {
        dailyLockShow: false,
        toggleBtnChecked: false
      };
    },
    props: {
      show: {
        type: Boolean
      }
    },
    created: function() {
      let dailyLock = getUserDailyLock(this.userData.info.id);
      this.toggleBtnChecked = dailyLock.lockStatus;
    },
    methods: {
      hide: function() {
        this.$emit('hide-setting');
      },
      hideDailyLock: function() {
        this.dailyLockShow = false;
        this.toggleBtnChecked = false;
      },
      completeSet: function() {
        this.dailyLockShow = false;
      },
      btnOnchange: function() {
        this.toggleBtnChecked = !this.toggleBtnChecked;
        if(this.toggleBtnChecked === false) {
           let dailLock = getUserDailyLock(this.userData.info.id);
           dailLock.lockStatus = false;
           setUserDailyLock(this.userData.info.id, dailLock);
        }
      },
      logout: function() {
        this.$router.push('/login');
      }
    },
    components: {
      'toggle-btn': toggleBtn,
      'daily-lock': dailyLock
    },
    computed: {
      userData: function() {
        return this.$store.state.userData;
      }
    },
    watch: {
      toggleBtnChecked: function(val) {
        let dailyLock = getUserDailyLock(this.userData.info.id);
        if((!dailyLock || dailyLock.lockStatus === false) && val === true) {
          // 如果当前日记密码为关闭或用户未设置日记锁
          // 而且当时开关按钮是打开状态
          // 那么显示密码锁组件
          this.dailyLockShow = val;
        }
      },
      show: function() {
        // 因为在退出账号后再登录setting 组件会出现加载id 出错问题导致日记密码开关按钮显示与实际不符
        // 所以在 setting 的show 属性加一个变化监听 这样能获取正确的值 更改按钮状态
        let dailyLock = getUserDailyLock(this.userData.info.id);
        if(!dailyLock || dailyLock.lockStatus === false) {
          this.toggleBtnChecked = false;
        }else {
          this.toggleBtnChecked = dailyLock.lockStatus;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .setting-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: #dedede
    z-index: 60
    &.setting-wrapper-slide-enter
      transform: translate3d(-100%,0,0)
    &.setting-wrapper-slide-enter-active
      transition: all .5s ease
    &.setting-wrapper-slide-enter-to
      transform: translate3d(0,0,0)
    &.setting-wrapper-slide-leave-active
      transition: all .5s ease
    &.setting-wrapper-slide-leave-to
      transform: translate3d(-100%,0,0)
    .setting-header
      position: relative
      width: 100%
      height: 100px
      &.male-theme
        background-color: #4889B4
      &.female-theme
        background-color: #FE706F
      .setting-title
        height: 100px
        line-height: 100px
        color: #fff
        text-align: center
      .close-btn
        position: absolute
        top: 50%
        left: 12px
        margin-top: -14px
        padding: 5px
        font-size: 18px
        color: #fff
    .setting-main
      .daily-lock
        height: 45px
        line-height: 45px
        margin-top: 30px
        padding-left: 12px
        color: #7F7F7F
        background-color: #fff
        .btn-slider-wrapper
          float: right
          margin-top: 10px
      .logout-btn
        height: 45px
        line-height: 45px
        margin-top: 30px
        padding-left: 12px
        color: #de3433
        text-align: center
        background-color: #fff
</style>
