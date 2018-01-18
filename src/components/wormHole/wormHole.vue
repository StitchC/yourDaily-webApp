<template>
    <transition name="hole-slide">
      <div class="worm-hole-wrapper" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}" v-show="show">
        <div class="worm-hole-header">
          <i class="icon icon-arrow-left" @click="close"></i>
        </div>
        <div class="logo">
          <img src="./hole-logo.png" alt="">
          <p class="txt">进入虫洞, 遇见神秘的TA</p>
        </div>
        <div class="btn-group">
          <div class="time-hint" v-show="userInfo.matchStatus === randomMatchTimeShow">距离虫洞打开时间还有: {{timeTxt}}</div>
          <div class="left-match-time-hint" v-show="leftTimeShow">距离匹配结束还有: {{leftTimeTxt}}</div>
          <div class="random-match" v-show="userInfo.matchStatus === '0'" @click="randomMatch">
            <img :src="btnIcon" alt="" class="btn-icon">
            <span class="txt">随机匹配</span>
          </div>
          <div class="unlink-match" v-show="userInfo.matchStatus === '1'">
            <span class="txt">断开链接</span>
          </div>
          <span class="cancel-match" v-show="userInfo.matchStatus === '2'">取消匹配</span>
        </div>
        <div class="hint">
          <div class="title-wrap">
            <span class="txt">Tips</span>
          </div>
          <p class="desc">虫洞将会在晚上 20:00 打开</p>
          <p class="desc">你可以在这个时间点前进入匹配空间</p>
          <p class="desc">匹配时间会持续一小时(20:00 - 21:00)</p>
          <p class="desc">匹配进行期间不能进入匹配空间</p>
        </div>
      </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    /**
     * 虫洞匹配组件
     *
     * @param {Boolean} show - 控制组件的显示或隐藏
     *
     * @event close-hole - 触发父组件事件
     * */

    import {mapGetters} from 'vuex';

    // 定义虫洞匹配时间的时分秒
    const MATCH_HOUR = 20;
    const MATCH_MIN = 60;
    const MATCH_SEC = 60;

    // 定义虫洞运作的时间
    const OPERATE_HOUR = 21;
    const OPERATE_MIN = 60;
    const OPERATE_SEC = 60;

    // 用户匹配状态
    // const MATCHING = '2';

    export default {
        data() {
          return {
            time: new Date(),
            leftMatchTime: new Date()
          };
        },
        props: {
          show: {
            type: Boolean
          }
        },
        created() {
          if(this.userInfo.matchStatus === '2') {
            this._interval();
          }
          /*
          this._interval();
          if(this.time.getHours() >= 20) {
            this._calcEndMatchTime();
          }
          */
        },
        methods: {
          _interval() {
            // 设置检测时间变化函数
            this.time = new Date();
            this.timer = setTimeout(this._interval(), 1000);
          },
          close() {
            this.$emit('close-hole');
          },
          randomMatch() {
            this._calcRandomMatchTime();
          }
        },
        computed: {
          ...mapGetters({
            userInfo: 'getInfo'
          }),
          btnIcon() {
            return this.userInfo.sex === '1' ? '/static/images/male-random.png' : '/static/images/female-random.png';
          },
          timeTxt() {
           let hour = MATCH_HOUR - this.time.getHours();
           let min = MATCH_MIN - this.time.getMinutes() === 60 ? 0 : MATCH_MIN - this.time.getMinutes();
           let sec = MATCH_SEC - this.time.getSeconds() === 60 ? 0 : MATCH_SEC - this.time.getSeconds();

           hour = (hour + '').padStart(2, '0');
           min = (min + '').padStart(2, '0');
           sec = (sec + '').padStart(2, '0');

           return `${hour} : ${min} : ${sec}`;
          },
          leftTimeTxt() {
            if(this.leftMatchTime) {
              let hour = OPERATE_HOUR - this.leftMatchTime.getHours();
              let min = OPERATE_MIN - this.leftMatchTime.getMinutes() === 60 ? 0 : MATCH_MIN - this.time.getMinutes();
              let sec = OPERATE_SEC - this.leftMatchTime.getSeconds() === 60 ? 0 : MATCH_SEC - this.time.getSeconds();

              hour = (hour + '').padStart(2, '0');
              min = (min + '').padStart(2, '0');
              sec = (sec + '').padStart(2, '0');

              return `${hour} : ${min} : ${sec}`;
            }
            return '';
          },
          leftTimeShow() {

          },
          randomMatchTimeShow() {

          }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

  .worm-hole-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: #fff
    z-index: 60
    &.hole-slide-enter
      transform: translate3d(100%,0,0)
    &.hole-slide-enter-to
      transform: translate(0,0,0);
    &.hole-slide-enter-active
      transition: all .4s ease
    &.hole-slide-leave-to
      transform: translate3d(100%,0,0);
    &.hole-slide-leave-active
      transition: all .4s ease
    .worm-hole-header
      padding: 10px 0 0 10px
      .icon
        font-size: 30px
    .logo
      margin-top: 45px
      text-align: center
      .txt
        margin-top: 10px
        color: #999
        font-size: $font-size-middle
    .btn-group
      .time-hint,
      .left-match-time-hint
        line-height: 20px
        text-align: center
        color: #9d9d9d
        font-size: $font-size-middle
      .random-match,
      .unlink-match
        position: relative
        width: 180px
        height: 38px
        line-height: 38px
        margin: 20px auto 0
        font-size: $font-size-middle
        .btn-icon
          position: absolute
          top: 9px
          left: 10px
          width: 20px
          height: 20px
        .txt
          display: block
          width: 100%
          text-align: center
      .random-match
        background-color: #ececec
        color: #808080
      .unlink-match
        background-color: #7fc6a3
        color: #ffffff
      .cancel-match
        display: block
        width: 80px
        margin: 10px auto 0
        text-align: center
        color: #a02232
        font-size: $font-size-middle
    .hint
      position: absolute
      bottom: 10px
      width: 100%
      .title-wrap
        width: 100px
        height: 1px
        line-height: 1px
        margin: 0 auto
        background-color: #d9d9d9
        text-align: center
        .txt
          vertical-align: top
          padding: 0 15px
          background-color: #fff
          color: #c6c6c6
          font-size: $font-size-small
      .desc
        margin-top: 12px
        text-align: center
        font-size: $font-size-small
        color: #acacac
    &.male-theme
      .worm-hole-header
        .icon
          color: $male-color
    &.female-theme
      .worm-hole-header
        .icon
          color: $female-color

  @media screen and (max-height: 480px)
    // 兼容iphone4
    .worm-hole-wrapper
      .logo
        margin-top: 20px
        img
          width: 80px
</style>
