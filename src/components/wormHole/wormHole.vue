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
          <div class="time-hint" v-show="randomMatchTimeShow">匹配中...</div>
          <div class="left-match-time-hint" v-show="leftTimeShow">虫洞开启中...</div>
          <div class="random-match" v-show="randomMatchBtnShow" @click="joinMatch">
            <img :src="btnIcon" alt="" class="btn-icon">
            <span class="txt">随机匹配</span>
          </div>
          <div class="unlink-match" v-show="userInfo.matchStatus === '1'" @click="unlink">
            <span class="txt">断开链接</span>
          </div>
          <span class="cancel-match" v-show="cancelMatchBtnShow" @click="cancelMatch">取消匹配</span>
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
        <loading :show="loadingShow"></loading>
        <alert-dialog :dialogShow.sync="alertDialogShow" :txt="alertDialogTxt"></alert-dialog>
        <hint-dialog :show="hintDialogShow" :delay="800" :hint-txt="hintTxt" @will-hide="hintWillHide"></hint-dialog>
      </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    /**
     * 虫洞匹配组件
     *
     * @param {Boolean} show - 控制组件的显示或隐藏 (双向数据绑定)
     *
     * @event close-hole - 触发父组件事件
     * */


    import alert from 'base/alertDialog/alertdialog.vue';
    import hintDialog from 'base/hintDialog/hintDialog.vue';
    import loading from 'base/loading/loading.vue';

    import {mapGetters, mapActions} from 'vuex';
    import {SUCCESS_CODE} from 'api/statusCode.js';
    import {netWorkError} from 'common/js/dialog.js';
    import setDateTime from 'common/js/setDateTime.js';

    // 定义虫洞匹配时间的时分秒
    const MATCH_TIME = setDateTime({
      h: 20,
      m: 0,
      s: 0
    });


    // 定义虫洞运作的时间
    const HOLE_RUNTIME = setDateTime(21, 0, 0);



    export default {
        data() {
          return {
            time: new Date(),
            leftMatchTime: new Date(),
            alertDialogShow: false,
            hintDialogShow: false,
            loadingShow: false,
            alertDialogTxt: '',
            hintTxt: ''
          };
        },
        props: {
          show: {
            type: Boolean
          }
        },
        created() {
          console.log(MATCH_TIME);
        },
        components: {
          'alert-dialog': alert,
          'hint-dialog': hintDialog,
          loading
        },
        methods: {
          ...mapActions([
            'reloadUserInfo',
            'reloadData'
          ]),
          _interval() {
            // 设置检测时间变化函数
            this.time = new Date();
            this.timer = setTimeout(this._interval, 1000);
          },
          _diffTime(endTime) {
            // 获得时间的差值
            let diffDate;
            /*
            if(this.time.getHours() >= 21) {
              // 如果当前用户加入的匹配事件大于21 点
              // 时间的差值计算为 明天的20点 减去 当前时间
              let nextDate = new Date(endTime).setDate(new Date().getDate() + 1);
              diffDate = new Date(nextDate).getTime() - this.time.getTime();
            }else {
              // 否则直接计算时间差值
              diffDate = new Date(endTime).getTime() - this.time.getTime();
            }
            */
            let hour = Math.floor(diffDate / 1000 / 60 / 60);
            let minutes = Math.floor(diffDate / 1000 / 60 % 60);
            let seconds = Math.floor(diffDate / 1000 % 60);

            hour = (hour + '').padStart(2, 0);
            minutes = (minutes + '').padStart(2, 0);
            seconds = (seconds + '').padStart(2, 0);

            return `${hour} : ${minutes} : ${seconds}`;
          },
          _updateMatchStatus({url, params}) {
            return this.$http.post(url, params, {
              before() {
                this._toggleLoadingDialog();
              },
              emulateJSON: true
            });
          },
          _toggleLoadingDialog() {
            this.loadingShow = !this.loadingShow;
          },
          _showAlertDialog(txt = netWorkError) {
            this.alertDialogShow = !this.alertDialogShow;
            this.alertDialogTxt = txt;
          },
          _toggleHintDialog(txt = '') {
            this.hintDialogShow = !this.hintDialogShow;
            this.hintTxt = txt;
          },
          _afterModifySend(res, hintTxt) {
            let data = res.body;

            if(data.status === SUCCESS_CODE) {
              // 修改匹配状态成功后 重新请求用户信息数据 更新 vuex
              this.reloadUserInfo({
                id: this.userInfo.id
              }).then(() => {
                // 隐藏loading
                this._toggleLoadingDialog();
                // 显示提示框
                this._toggleHintDialog(hintTxt);
              });
            }else {
              this._toggleLoadingDialog();
              this._showAlertDialog();
            }
          },
          _afterUnlink(res, hintTxt) {
            let data = res.body;

            if(data.status === SUCCESS_CODE) {
              // 断开匹配对象的链接后 重新请求用户信息数据 更新 vuex
              this.reloadData({
                id: this.userInfo.id,
                connect: ''
              }).then(() => {
                // 隐藏loading
                this._toggleLoadingDialog();
                // 显示提示框
                this._toggleHintDialog(hintTxt);
              });
            }else {
              this._toggleLoadingDialog();
              this._showAlertDialog();
            }
          },
          hintWillHide(promise) {
            promise.then(() => {
              this._toggleHintDialog();
            });
          },
          close() {
            this.$emit('update:show', false);
          },
          joinMatch() {
            if(this.userDaily instanceof Array) {
              this._showAlertDialog('请留下一篇日记才进行匹配哦');
              return;
            }else {
              this._updateMatchStatus({
                url: '/yourdaily/php/user/joinMatch.php',
                params: {
                  id: this.userInfo.id,
                  sex: this.userInfo.sex,
                  status: 2
                }
              }).then((res) => {
                this._afterModifySend(res, '加入成功！');
              }).catch(() => {
                this._toggleLoadingDialog();
                this._showAlertDialog();
              });
            }
          },
          cancelMatch() {
            this._updateMatchStatus({
              url: '/yourdaily/php/user/cancelMatch.php',
              params: {
                id: this.userInfo.id,
                status: 0
              }
            }).then((res) => {
              this._afterModifySend(res, '取消成功');
            }).catch(() => {
              this._toggleLoadingDialog();
              this._showAlertDialog();
            });
          },
          unlink() {
            this._updateMatchStatus({
              url: '/yourdaily/php/user/unlinkMatch.php',
              params: {
                id: this.userInfo.id,
                connectId: this.userInfo.connect
              }
            }).then((res) => {
              this._afterUnlink(res, '断开成功');
            }).catch(() => {
              this._toggleLoadingDialog();
              this._showAlertDialog();
            });
          }
        },
        watch: {
          show(val) {
            if(val === true) {
              this._interval();
            }else {
              clearTimeout(this.timer);
            }
          },
          time(val) {
            if(val.getHours() >= 21 && this.userInfo.matchStatus === '2') {
              // 如果当前时间为21点或之后 而且用户为正在匹配状态
              // 更新一次用户的信息数据
              this.reloadUserInfo({
                id: this.userInfo.id
              }).then(() => {
                this.reloadData({
                  id: this.userInfo.id,
                  connectId: this.userInfo.connect
                });
              });
            }
          }
        },
        computed: {
          ...mapGetters({
            userInfo: 'getInfo',
            userDaily: 'getDaily'
          }),
          btnIcon() {
            return this.userInfo.sex === '1' ? './static/images/male-random.png' : './static/images/female-random.png';
          },
          timeTxt() {
            // 存在性能问题 待优化
            return this._diffTime(MATCH_TIME);
          },
          leftTimeTxt() {
            // 存在性能问题 待优化
            return this._diffTime(HOLE_RUNTIME);
          },
          leftTimeShow() {
            // 如果时间在 20 - 21 点之间
            // 将匹配操作剩余时间显示
            if(this.time.getHours() <= 21 && this.time.getHours() >= 20) {
              return true;
            }else {
              return false;
            }
          },
          randomMatchTimeShow() {
            // 如果用户当前匹配状态为 '正在匹配' 且 时间在20 点前
            // 将虫洞开启倒计时显示
            let limitTime = this.time.getHours() < 20 || this.time.getHours() >= 21;
            if(this.userInfo.matchStatus === '2' && limitTime) {
              return true;
            }else {
              return false;
            }
          },
          randomMatchBtnShow() {
            // 如果用户为未匹配用户 且 时间在 20点之前或 21 点之后
            // 显示随机匹配的按钮
            let curHour = this.time.getHours();
            let isLimitTime = curHour < 20 || curHour >= 21;
            if(this.userInfo.matchStatus === '0' && isLimitTime) {
              return true;
            }else {
              return false;
            }
          },
          cancelMatchBtnShow() {
            // 当用户为 '正在匹配' 且时间在20点前或21点后
            // 显示取消匹配按钮
            let limitTime = this.time.getHours() < 20 || this.time.getHours() >= 21;
            if(this.userInfo.matchStatus === '2' && limitTime) {
              return true;
            }else {
              return false;
            }
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
    &.hole-slide-enter-active
      transition: all .5s ease
    &.hole-slide-enter-to
      transform: translate3d(0,0,0)
    &.hole-slide-leave-active
      transition: all .5s ease
    &.hole-slide-leave-to
      transform: translate3d(100%,0,0)
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
        margin-top: 10px
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
