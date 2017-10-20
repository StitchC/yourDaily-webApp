<template>
  <transition name="daily-lock-slide">
    <div class="daily-lock-wrapper" v-show="show">
      <div class="pwd-hint" v-show="status === 1">密码错误</div>
      <div class="complete-btn-wrapper" v-show="curInputNums.length === 4 && status === 0" @click="completeLockSetting"><span class="complete-btn icon-arrow-left"></span>完成</div>
      <div class="num-screen">
        <div class="num-holder" :class="{'has-content': curInputNums.length > 0}"></div>
        <div class="num-holder" :class="{'has-content': curInputNums.length > 1}"></div>
        <div class="num-holder" :class="{'has-content': curInputNums.length > 2}"></div>
        <div class="num-holder" :class="{'has-content': curInputNums.length > 3}"></div>
      </div>
      <div class="num-wrap">
        <div class="num" v-for="item in nums" @click="numClick($event, item)">{{item}}</div>
      </div>
      <span class="close-btn icon-close" v-show="curInputNums.length === 0 && status === 0" @click="closeDailyLock"></span>
      <span class="backspace-btn icon-arrow-return" v-show="curInputNums.length !== 0" @click="backspace"></span>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
   import {setUserDailyLock} from 'common/js/localStorage.js';
  /**
   *  日记锁组件
   *  参数:
   *    show:
   *    类型: boolean
   *    描述: 控制日记锁的显示
   *
   *    status:
   *    类型: Number
   *    描述: 控制密码输入组件的状态 1: 验证密码状态，0: 编辑密码状态
   *
   *  事件:
   *    daily-lock-hide 关闭日记锁界面
   *    daily-lock-settring-complete 日记锁设置完成时关闭日记锁界面
   *
   * */

  export default {
    data: function() {
      return {
        nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        curInputNums: []
      };
    },
    props: {
      show: {
        type: Boolean
      },
      status: {
        type: Number
      }
    },
    methods: {
      numClick: function(event, val) {
        if(this.curInputNums.length < 4) {
          this.curInputNums.push(val);
        }
      },
      closeDailyLock: function() {
        this.$emit('daily-lock-hide');
      },
      backspace: function() {
        if(this.curInputNums.length > 0) {
          this.curInputNums.pop();
        }
      },
      completeLockSetting: function() {
        let data = {};
        data.lockStatus = true;
        data.lockNum = this.curInputNums.join('');
        setUserDailyLock(this.userData.info.id, data);
        this.$emit('daily-lock-settring-complete');
      }
    },
    computed: {
      userData: function() {
        return this.$store.state.userData;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .daily-lock-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: #EEEEEE
    &.daily-lock-slide-enter
      transform: translate3d(0,100%,0)
    &.daily-lock-slide-enter-active
      transition: all .4s ease
    &.daily-lock-slide-enter-to
      transform: translate3d(0,0,0)
    &.daily-lock-slide-leave-to
      transform: translate3d(0,100%,0)
    &.daily-lock-slide-leave-active
      transition: all .4s ease
    .complete-btn-wrapper
      width: 60px
      height: 30px
      line-height: 30px
      padding: 10px 0 0 10px
      color: #666
      font-size: 18px
      .complete-btn
        vertical-align: middle
    .num-screen
      width: 200px
      height: 60px
      line-height: 60px
      margin: 50px auto 0 auto
      text-align: center
      .num-holder
        display: inline-block
        vertical-align: text-bottom
        width: 20px
        height:1px
        border-bottom: 1px solid #666
        font-size: 0
        &.has-content
          vertical-align: middle
          width: 10px
          height: 10px
          border-radius: 50%
          background-color: #666
    .num-wrap
      display: flex
      justify-content: space-around
      flex-wrap: wrap
      width: 240px
      margin: 50px auto
      .num
        width: 60px
        height: 60px
        line-height: 60px
        margin-top: 20px
        border: 1px solid #666
        border-radius: 50%
        text-align: center
    .close-btn, .backspace-btn
      position: absolute
      bottom: 20px
      left: 50%
      margin-left: -25px
      width: 50px
      height: 50px
      font-size: 30px
      color: #666
</style>
