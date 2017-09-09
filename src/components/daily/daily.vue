<template>
  <div class="daily-wrapper">
    <div class="no-daily-hint">
      <h3 class="hint-title">NO Enteries</h3>
      <p class="hint-txt">你还没有写过日记</p>
      <p class="begin-write-daily" :class="{'male-theme': userSex === 1, 'female-theme': userSex === 0}" @click="toggleNotepadShow">开始写日记</p>
    </div>
    <div class="daily-bottom-bar" :class="{'male-theme': userSex === 1, 'female-theme': userSex === 0}">
      <span class="write-daily-btn icon-pen" @click="toggleNotepadShow"></span>
      <span class="total-daily-num">共0篇日记</span>
    </div>
    <daily-notepad :user-sex="userSex" :cur-time="notepadDate" :notepad-show="notepadShow" @notepad-close="notepadClose"></daily-notepad>
  </div>
</template>

<script type="text/ecmascript-6">
   import {getLocalStorage} from 'common/js/localStorage.js';
   import dailyNotePad from 'components/dailyNotePad/dailynotepad.vue';

   /**
    * 当前面user 组件进行了一连串的对用户性别的判断到最后会采用的异步的过程跳转到这个daily 组件中
    * 组件可能还没有获得数据 不过没关系 vue 的响应式数据会为这个组件异步填充数据
    *
    * 而这个组件会执行如下一系列的初始化动作：
    *   1、 通过 localStorage 获取用户的性别 初始化组件各部分的样式 实现不同性别用户不同风格
    *
    *   2、判断用户数据中的日记内容是否为空 为空会显示class 为 no-daily-hint 这个元素 否则隐藏
    *
    * 写日记的功能：
    *   写日记功能基本在dailynotepad 组件中实现 请看dailynotepad 组件的注释
    */
  export default {
    data: function() {
      return {
        userSex: -1,
        curTime: false,
        notepadDate: null,
        notepadShow: false
      };
    },
    created: function() {
      let data = getLocalStorage('ohMyDaily');
      let user = JSON.parse(data.userData);
      this.userSex = parseInt(user.sex);
    },
    props: {
      userData: {
        type: Object
      }
    },
    components: {
      'daily-notepad': dailyNotePad
    },
    methods: {
      notepadClose: function(bool) {
        this.notepadShow = bool;
      },
      toggleNotepadShow: function() {
        this.notepadShow = true;
        this.notepadDate = new Date();
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .daily-wrapper
    width: 100%
    height: 100%
    padding-top: 1px
    .no-daily-hint
      position: absolute
      width: 300px
      height: 200px
      top: 50%
      left: 50%
      margin: -100px 0 0 -150px
      border-radius: 5px
      background-color: #fff
      .hint-title
        line-height: 40px
        margin-top: 30px
        font-size: 40px
        color: #757675
        text-align: center
      .hint-txt
        line-height: 20px
        margin-top: 20px
        font-size: 20px
        color: #757675
        text-align: center
      .begin-write-daily
        margin-top: 40px
        font-size: 16px
        text-align: center
        text-decoration: underline
        &.male-theme
          color: #4889B4
        &.female-theme
          color: #FE706F
    .daily-bottom-bar
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: 50px
      &.male-theme
        background-color: #4889B4
        .write-daily-btn
          color: #4889B4
      &.female-theme
        background-color: #FE706F
        .write-daily-btn
          color: #FE706F
      .write-daily-btn
        position: absolute
        display: inline-block
        top: 50%
        left: 50%
        width: 40px
        height: 40px
        line-height: 40px
        margin: -20px 0 0 -20px
        border-radius: 5px
        background-color: #fff
        text-align: center
        font-size: 20px
        font-weight: bold
      .total-daily-num
        position: absolute
        right: 10px
        top: 5px
        line-height: 40px
        color: #fff
</style>
