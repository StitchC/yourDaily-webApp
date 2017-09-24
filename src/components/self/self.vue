<template>
  <div class="self-wrapper">
    <div class="user-detail" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}">
      <div class="user-detail-main">
        <div class="avatar-wrap">
          <img :src="avatar">
        </div>
        <div class="detail-content">
          <p class="user-name">{{userData.info.username}}</p>
          <p class="user-motto">{{userData.info.motto}}</p>
        </div>
      </div>
      <div class="edit-user-info-wrap" @click="showModifyInfo">
        <span class="icon-edit"></span>
        修改
      </div>
    </div>
    <div class="user-info">
      <div class="daily-count">
        <p>{{userData.info.count}}</p>
        <p>篇</p>
      </div>
      <div class="word-count">
        <p>{{userData.info.words}}</p>
        <p>字</p>
      </div>
      <div class="photo-count">
        <p>0</p>
        <p>图</p>
      </div>
    </div>
    <modify-user-info :modify-info-show="toggleModifyInfo" :user-data="userData" @modify-info-close="closeModifyInfo"></modify-user-info>
  </div>
</template>

<script type="text/ecmascript-6">
  import modifyUserInfo from 'components/modifyUserInfo/modifyUserInfo.vue';

  export default {
    data: function() {
      return {
        toggleModifyInfo: false
      };
    },
    created: function() {
      console.log(this.$store.state.userData);
    },
    components: {
      'modify-user-info': modifyUserInfo
    },
    methods: {
      closeModifyInfo: function() {
        this.toggleModifyInfo = false;
      },
      showModifyInfo: function() {
        this.toggleModifyInfo = true;
      }
    },
    computed: {
      userData: function() {
        return this.$store.state.userData;
      },
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
  .self-wrapper
    width: 100%
    height: 100%
    padding-top: 100px
    background-color: #EFF0EF
    .user-detail
      position: relative
      width: 100%
      height: 120px
      padding-top: 1px
      &.male-theme
        background-color: #4889B4
      &.female-theme
        background-color: #FE706F
      .user-detail-main
        width: 100%
        height: 80px
        margin-top: 20px
        font-size: 0
        .avatar-wrap
          display: inline-block
          vertical-align: top
          width: 80px
          height: 80px
          line-height: 80px
          margin-left: 24px
          border-radius: 50%
          img
            width: 100%
            height: 100%
            border-radius: 50%
        .detail-content
          display: inline-block
          height: 80px
          margin-left: 12px
          font-size: 14px
          .user-name
            line-height: 50px
            font-size: 16px
            color: #fff
          .user-motto
            font-size: 12px
            color: rgba(255,255,255,0.4)
      .edit-user-info-wrap
        position: absolute
        top: 50px
        right: 12px
        width: 60px
        height: 25px
        line-height: 25px
        border-radius: 5px
        border: 1px solid #fff
        color: #fff
        text-align: center
    .user-info
      display: flex
      width: 100%
      height: 60px
      background-color: #fff
      .daily-count
        flex: 1
        line-height: 20px
        padding-top: 10px
        border-right: 1px solid #ccc
        text-align: center
        font-size: 14px
        color: #6A6B6A
      .word-count
        flex: 1
        line-height: 20px
        padding-top: 10px
        border-right: 1px solid #ccc
        text-align: center
        font-size: 14px
        color: #6A6B6A
      .photo-count
        flex: 1
        line-height: 20px
        padding-top: 10px
        text-align: center
        font-size: 14px
        color: #6A6B6A

  @media screen and (max-width: 320px)
    .self-wrapper
      .user-detail
        .user-detail-main
          .avatar-wrap
            width: 50px
            height: 50px
            margin-top: 15px
            margin-left: 12px
          .detail-content
            .user-name
              line-height: 50px
              font-size: 14px
            .user-motto
              font-size: 12px
              line-height: 10px
      .edit-user-info-wrap
          width: 50px !important
          font-size: 12px
</style>
