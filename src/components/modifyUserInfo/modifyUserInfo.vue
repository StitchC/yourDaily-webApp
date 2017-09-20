<template>
  <transition name="modify-info-slide">
    <div class="modify-user-info-wrapper" v-show="show">
      <div class="modify-user-info-header" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}">
        <span class="close-btn icon-close" @click="close"></span>
        <h3 class="header-title">修改信息</h3>
      </div>
      <div class="modify-user-info-main">
        <div class="info-content-wrap user-avatar">
          <span class="title">头像</span>
          <div class="info-content avatar-wrap">
            <img :src="avatar">
          </div>
        </div>
        <div class="info-content-wrap user-name">
          <span class="title">你的名字</span>
          <span class="info-content user-name-content">{{userData.info.username}}</span>
          <span class="edit-btn icon-arrow-right" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}" @click="modifyUserName"></span>
        </div>
        <div class="info-content-wrap user-motto">
          <span class="title">格言</span>
          <span class="info-content user-otto-content">{{userData.info.motto}}</span>
          <span class="edit-btn icon-arrow-right" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}" @click="modifyMotto"></span>
        </div>
        <div class="info-content-wrap user-sex">
          <span class="title">身份</span>
          <span class="info-content user-sex-content" :class="{'icon-male-icon': userData.info.sex === '1', 'icon-female-icon': userData.info.sex === '0'}"></span>
          <span class="edit-btn icon-arrow-right" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}"></span>
        </div>
      </div>
      <info-input :initData="initInfoInput" :input-show="toggleInput" @input-close="closeInput"></info-input>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import infoInput from 'components/modifyInfoInput/modifyInfoInput.vue';

  export default {
    data: function() {
      return {
        show: this.modifyInfoShow,
        initInfoInput: {},
        toggleInput: true
      };
    },
    props: {
      userData: {
        type: Object
      },
      modifyInfoShow: {
        type: Boolean
      }
    },
    components: {
      'info-input': infoInput
    },
    methods: {
      close: function() {
        this.$emit('modify-info-close');
      },
      modifyUserName: function() {
        this.initInfoInput = {
          title: '修改用户名',
          modifyType: 0,
          content: this.userData.info.username,
          userSex: parseInt(this.userData.info.sex),
          userId: this.userData.info.id
        };
        this.toggleInput = true;
      },
      modifyMotto: function() {
        this.initInfoInput = {
          title: '修改格言',
          modifyType: 1,
          content: this.userData.info.motto,
          userSex: parseInt(this.userData.info.sex),
          userId: this.userData.info.id
        };
        this.toggleInput = true;
      },
      closeInput: function() {
        this.toggleInput = false;
      }
    },
    watch: {
      modifyInfoShow: function(val) {
        this.show = val;
      }
    },
    computed: {
      avatar: function() {
        if(this.userData.info.avatar === '') {
          if(this.userData.info.sex === '1') {
            return '/static/images/male-avatar.jpg';
          }else {
            return '/static/images/female-avatar.jpg';
          }
        }else {
          return this.userData.info.avatar;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .modify-user-info-wrapper
    position: fixed
    top: 0
    lefft: 0
    width: 100%
    height: 100%
    background-color: #fff
    z-index: 90
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
        background-color:  #4889B4
      &.female-theme
        background-color:  #FE706F
      .close-btn
        position: absolute
        top: 20px
        left: 12px
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
          font-size: 16px
        .info-content
          display: inline-block
          vertical-align: middle
          padding-left: 12px
          height: 60px
          line-height: 60px
          font-size: 14px
          &.avatar-wrap
            display: inline-block
            vertical-align: middle
            padding-left: 0
            margin-left: 12px
            width: 50px
            height: 50px
            line-height: 60px
            border-radius: 50%
            img
              width: 100%
              height: 100%
              border-radius: 50%
          &.user-sex-content.icon-male-icon
            height: 60px
            line-height: 60px
            font-size: 24px
            color: #4889B4
          &.user-sex-content.icon-female-icon
            height: 60px
            line-height: 60px
            font-size: 24px
            color: #FE706F

        .edit-btn
          position: absolute
          top: 10px
          right: 12px
          width: 20px
          height:40px
          line-height: 40px
          font-size: 18px
          &.male-theme
            color: #4889B4
          &.female-theme
            color: #FE706F
</style>
