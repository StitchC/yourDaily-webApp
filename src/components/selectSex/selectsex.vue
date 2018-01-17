<template>
  <transition name="selectSex-fade">
    <div class="select-sex-wrapper" :class="{'male-style': curSex === 1, 'female-style': curSex === 0}" v-show="show">
      <h3 class="title">请选择身份</h3>
      <div class="sex-option">
        <div class="sex-btn male-btn icon-male-icon" @click="sexSelect(1)"></div>
        <div class="sex-btn female-btn icon-female-icon" @click="sexSelect(0)"></div>
      </div>
      <div class="enter-wrap">
        <div class="enter" v-show="curSex !== 2" @click="enterDaily">进入你的日记</div>
      </div>
      <alert-dialog :dialog-show="dialogShowStatus" :txt="dialogTxt" @dialog-show-change="listenDialogStatus"></alert-dialog>
      <loading :show="loadingShow"></loading>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import alertdialog from 'base/alertDialog/alertdialog.vue';
  import loading from 'base/loading/loading.vue';
  import {SUCCESS_CODE} from 'api/statusCode';
  import {netWorkError} from 'common/js/dialog';

  /**
   * 选择性别组件
   * @param {Boolean} selectShow - 控制组件的显示或隐藏
   * @param {String} userId - 当选择完性别的时候根据 userId 提交到数据库
   *
   *
   * @event select-complete - 数据提交后台完成后触发此事件通知父组件
   * @event before-select - 发送更改性别请求之前触发父组件事件
   * */

  export default {
    data() {
      return {
        curSex: 2,
        dialogShowStatus: false,
        dialogTxt: '',
        loadingShow: false
      };
    },
    methods: {
      sexSelect(val) {
        this.curSex = val;
      },
      _toggleLoading() {
        this.loadingShow = !this.loadingShow;
      },
      enterDaily() {
        this.$http.post('/yourdaily/php/user/modifySex.php', {
          sex: this.curSex,
          id: this.userId
        }, {
          emulateJSON: true,
          before() {
           this.$emit('before-select');
          }
        }).then(res => {
          let data = res.body;
          if(data.status === SUCCESS_CODE) {
            this.$emit('select-complete', this.curSex);
            this.curSex = 2;
          }else {
            this.dialogShowStatus = true;
            this.dialogTxt = netWorkError;
          }
        });
      },
      listenDialogStatus: function(bool) {
        this.dialogShowStatus = bool;
      }
    },
    props: {
      selectShow: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String
      }
    },
    components: {
      'alert-dialog': alertdialog,
      loading
    },
    computed: {
      show: function() {
        return this.$store.state.selectSexShow;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

  .select-sex-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: #888988
    transition: all .4s linear
    z-index: 60
    &.selectSex-fade-enter
      opacity: 0
    &.selectSex-fade-enter-active
      transition: all .4s linear
    &.selectSex-fade-enter-to
      opacity: 1
    &.selectSex-fade-leave
      opacity: 0
    &.selectSex-fade-leave-active
      transition: all .3s linear
    .title
      margin-top: 10%
      color: #fff
      font-size: $font-size-large-X
      text-align: center
    .sex-option
      position: fixed
      display: flex
      justify-content: space-around
      align-items: center
      top: 30%
      width: 100%
      font-size: 0
      .sex-btn
        width: 100px
        height: 100px
        line-height: 100px
        border: 1px solid #fff
        border-radius: 5px
        font-size: 60px
        text-align: center
        color: #fff
        transition: all .3s linear
        &:last-child
          margin-left: 40px
    .enter-wrap
      position: fixed
      top: 80%
      width: 100%
      .enter
        width: 230px
        height: 45px
        line-height: 45px
        margin: 0 auto
        border: 1px solid #fff
        border-radius: 2px
        text-align: center
        color: #fff
  .female-style
    background-color: $female-color
    .female-btn
      background-color: #fff
      color: $female-color !important
  .male-style
    background-color: $male-color
    .male-btn
      background-color: #fff
      color: $male-color !important
</style>
