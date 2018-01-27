<template>
  <transition name="modify-info-slide">
    <div class="modify-user-info-wrapper" v-show="show">
      <div class="modify-user-info-header" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}">
        <span class="close-btn icon-close" @click="close"></span>
        <h3 class="header-title">修改信息</h3>
      </div>
      <div class="modify-user-info-main">
        <div class="info-content-wrap user-avatar">
          <span class="title">头像</span>
          <div class="info-content avatar-wrap">
            <img :src="avatar">
            <span class="edit-btn icon-arrow-right" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}" @click="modifyUserAvatar"></span>
          </div>
        </div>
        <div class="info-content-wrap user-name">
          <span class="title">你的名字</span>
          <span class="info-content user-name-content">{{userInfo.username}}</span>
          <span class="edit-btn icon-arrow-right" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}" @click="modifyUserName"></span>
        </div>
        <div class="info-content-wrap user-motto">
          <span class="title">格言</span>
          <span class="info-content user-otto-content">{{userInfo.motto}}</span>
          <span class="edit-btn icon-arrow-right" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}" @click="modifyMotto"></span>
        </div>
        <div class="info-content-wrap user-sex">
          <span class="title">身份</span>
          <span class="info-content user-sex-content" :class="{'icon-male-icon': userInfo.sex === '1', 'icon-female-icon': userInfo.sex === '0'}"></span>
          <span class="edit-btn icon-arrow-right" :class="{'male-theme': userInfo.sex === '1', 'female-theme': userInfo.sex === '0'}" @click="modifySex"></span>
        </div>
      </div>
      <info-input :init-data="initInfoInput" :show.sync="toggleInput"></info-input>
      <upload-image :show.sync="uploadImgShow"></upload-image>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import infoInput from 'components/modifyInfoInput/modifyInfoInput.vue';
  import uploadImage from 'components/uploadImage/uploadImage.vue';
  import {mapGetters, mapMutations} from 'vuex';


  /**
   * 个人资料组件
   *
   * @param {Boolean} modifyInfoShow - 个人资料组件显示或隐藏
   *
   * */

  export default {
    data() {
      return {
        show: this.modifyInfoShow,
        initInfoInput: {},
        toggleInput: false,
        uploadImgShow: false
      };
    },
    props: {
      show: {
        type: Boolean
      }
    },
    components: {
      'info-input': infoInput,
      'upload-image': uploadImage
    },
    methods: {
      ...mapMutations({
        toggleSelectSex: 'TOGGLE_SELECT_SEX'
      }),
      close() {
        this.$emit('update:show', false);
      },
      modifyUserAvatar() {
        this.uploadImgShow = true;
      },
      modifyUserName() {
        this.initInfoInput = {
          title: '修改用户名',
          modifyType: 0,
          content: this.userInfo.username,
          userSex: parseInt(this.userInfo.sex),
          userId: this.userInfo.id,
          connect: this.userInfo.connect,
          limit: 15
        };
        this.toggleInput = true;
      },
      modifyMotto() {
        this.initInfoInput = {
          title: '修改格言',
          modifyType: 1,
          content: this.userInfo.motto,
          userSex: parseInt(this.userInfo.sex),
          userId: this.userInfo.id,
          connect: this.userInfo.connect,
          limit: 30
        };
        this.toggleInput = true;
        this.$emit('update-data');
      },
      modifySex() {
        // 个人信息修改性别 将vuex toggleSelectSex 修改为true 弹出选择性别组件
        this.toggleSelectSex(true);
      }
    },
    watch: {
      modifyInfoShow(val) {
        this.show = val;
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'getInfo'
      }),
      avatar() {
        if(this.userInfo.avatar === '') {
          if(this.userInfo.sex === '1') {
            return '/static/images/male-avatar.jpg';
          }else {
            return '/static/images/female-avatar.jpg';
          }
        }else {
          return this.userInfo.avatar;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl"

  .modify-user-info-wrapper
    position: fixed
    top: 0
    lefft: 0
    width: 100%
    height: 100%
    background-color: #fff
    z-index: 55
    &.modify-info-slide-enter
      transform: translate3d(0,100%,0)
    &.modify-info-slide-enter-active
      transition: all .5s ease
    &.modify-info-slide-enter-to
      transform: translate3d(0,0,0)
    &.modify-info-slide-leave-to
      transform: translate3d(0,100%,0)
    &.modify-info-slide-leave-active
      transition: all .5s ease
    .modify-user-info-header
      position: relative
      width: 100%
      height: 100px
      &.male-theme
        background-color: $male-color
      &.female-theme
        background-color: $female-color
      .close-btn
        position: absolute
        top: 50%
        left: 12px
        margin-top: -14px
        padding: 5px
        font-size: 18px
        color: #fff
      .header-title
        height: 100px
        line-height: 100px
        text-align: center
        color: #fff
        font-size: 18px
    .modify-user-info-main
      .info-content-wrap
        position: relative
        height: 60px
        line-height: 60px
        padding: 0 12px
        border-bottom: 1px solid #ccc
        font-size: 0
        &:last-child
          border: none
        .title
          display: inline-block
          vertical-align: middle
          width: 80px
          font-size: $font-size-large
        .info-content
          display: inline-block
          vertical-align: middle
          padding-left: 12px
          height: 60px
          line-height: 60px
          font-size: $font-size-middle
          &.avatar-wrap
            display: inline-block
            vertical-align: middle
            padding-left: 0
            margin-left: 12px
            width: 50px
            height: 50px
            line-height: 60px
            border-radius: 50%
            overflow: hidden
            img
              width: 100%
          &.user-sex-content.icon-male-icon
            height: 60px
            line-height: 60px
            font-size: $font-size-large-X
            color: $male-color
          &.user-sex-content.icon-female-icon
            height: 60px
            line-height: 60px
            font-size: $female-color
            color: $female-color

        .edit-btn
          position: absolute
          top: 10px
          right: 12px
          width: 20px
          height:40px
          line-height: 40px
          font-size: 18px
          &.male-theme
            color: $male-color
          &.female-theme
            color: $female-color
</style>
