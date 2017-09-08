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
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import alertdialog from 'components/alertDialog/alertdialog.vue';

  const SUCCESS_CODE = 200;
  export default {
    data: function() {
      return {
        curSex: 2,
        show: this.selectShow,
        dialogShowStatus: false,
        dialogTxt: ''
      };
    },
    methods: {
      sexSelect: function(val) {
        this.curSex = val;
      },
      enterDaily: function() {
        this.$http.post('/yourdaily/php/user/modifySex.php', {
          sex: this.curSex,
          id: this.userId
        }, {emulateJSON: true}).then(res => {
          let data = res.body;
          if(data.status === SUCCESS_CODE) {
            this.show = false;
            this.$emit('selectsex-confirm', this.curSex);
          }else {
            this.dialogShowStatus = true;
            this.dialogTxt = '抱歉，你的网络当前可能有问题请稍后重试哦';
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
      'alert-dialog': alertdialog
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .select-sex-wrapper
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: #888988
    transition: all .3s linear
    z-index: 20
    &.selectSex-fade-enter
      opacity: 0
    &.selectSex-fade-enter-active
      transition: all .5s linear
    &.selectSex-fade-enter-to
      opacity: 1
    &.selectSex-fade-leave
      opacity: 0
    &.selectSex-fade-leave-active
      transition: all .5s linear
    .title
      margin-top: 10%
      color: #fff
      font-size: 24px
      text-align: center
    .sex-option
      position: fixed
      display: flex
      justify-content: space-around
      top: 30%
      width: 100%
      font-size: 0
      .sex-btn
        width: 135px
        height: 135px
        line-height: 135px
        border: 1px solid #fff
        border-radius: 5px
        font-size: 100px
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
    background-color: #FE706F
    .female-btn
      background-color: #fff
      color: #FE706F !important
  .male-style
    background-color: #4889B4
    .male-btn
      background-color: #fff
      color: #4889B4 !important
</style>
