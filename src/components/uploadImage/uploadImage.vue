<template>
  <transition name="upload-image-slide">
    <div class="upload-image-wrapper" :class="{'male-theme': userData.info.sex === '1', 'female-theme': userData.info.sex === '0'}" v-show="show">
      <div class="upload-image-header">
        <h3 class="title">上传文件</h3>
        <span class="close-btn icon-close" @click="close"></span>
      </div>
      <div class="upload-image-main">
        <div class="img-preview-area">
          <transition-group name="previewArea-slide" mode="out-in" tag="div">
            <div class="no-select-photo" v-show="imgURL === ''" key="hint">你还没有选择图片哦</div>
            <img :src="imgURL" v-show="imgURL !== ''" class="preview-img" key="preview-area">
          </transition-group>
        </div>
        <div class="select-img-btn">
          <span class="txt">选择图片</span>
          <input type="file" class="file-input" ref="fileInput" @change="imgChange">
        </div>
        <div class="upload-btn" @click="uploadImg">上传图片</div>
      </div>
      <alert-dialog :dialog-show="alertDialogShow" :txt="alertDialogTxt" @dialog-show-change="toggleAlertDialog"></alert-dialog>
      <loading :show="loadingShow"></loading>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import alertDialog from 'components/alertDialog/alertdialog.vue';
  import loading from 'components/loading/loading.vue';
  import {compressImg} from 'common/js/compressPhoto.js';

  const SUCCESS_CODE = 200;

  export default {
    data: function() {
      return {
        imgURL: '',
        fileContent: null,
        alertDialogShow: false,
        alertDialogTxt: '',
        loadingShow: false
      };
    },
    props: {
      show: {
        type: Boolean
      }
    },
    components: {
      'alert-dialog': alertDialog,
      'loading': loading
    },
    methods: {
      close: function() {
        this.$emit('upload-img-close');
        this.imgURL = '';
        this.fileContent = null;
      },
      imgChange: function() {
         if(this.$refs.fileInput.files[0]) {
           let reg = /image\/(jpg|png|jpeg)/;
           this.fileContent = this.$refs.fileInput.files[0];
           if(!reg.test(this.fileContent.type)) {
             this.alertDialogShow = true;
             this.alertDialogTxt = '上传的图片格式只能为 jpg,png,jpeg 哦';
           }else {
             compressImg(this.fileContent, 80, 80, (val) => {
               this.imgURL = val.compressImgUrl;
               this.fileContent = val.compressBlob;
             });
           }
         }
      },
      uploadImg: function() {
        if(!this.fileContent) {
            this.alertDialogShow = true;
            this.alertDialogTxt = '你还没有选择图片喔';
            return;
        }
        let formdata = new FormData();
        formdata.append('avatar', this.fileContent);
        formdata.append('id', this.$store.state.userData.info.id);
        this.$http.post('/yourdaily/php/user/uploadAvatar.php', formdata, {
          before: function() {
            this.loadingShow = true;
          }
        }).then((res) => {
          let data = res.body;
          if(data.status === SUCCESS_CODE) {
            this.$store.dispatch('requestNewData', {
              id: this.$store.state.userData.info.id,
              connectId: this.$store.state.userData.info.connect
            }).then(() => {
              this.loadingShow = false;
              this.imgURL = '';
              this.fileContent = null;
              this.$emit('upload-img-close');
            });
          }else {
            this.loadingShow = false;
            this.alertDialogShow = true;
            this.alertDialogTxt = '你的网络有点小问题请稍候重试哦';
          }
        });
      },
      toggleAlertDialog: function() {
        this.alertDialogShow = false;
      }
    },
    computed: {
      userData: function() {
        return this.$store.state.userData;
      }
    }
  };
</script>

<style lang="stylus">
  .upload-image-wrapper
    position: fixed
    width: 100%
    height: 100%
    top: 0
    left: 0
    background-color: #fff
    &.upload-image-slide-enter
      transform: translate3d(0,100%,0)
    &.upload-image-slide-enter-active
      transition: all .5s ease
    &.upload-image-slide-enter-to
      transform: translate3d(0,0,0)
    &.upload-image-slide-leave-to
      transform: translate3d(0,100%,0)
    &.upload-image-slide-leave-active
      transition: all .5s ease
    &.male-theme
      .upload-image-header
        background-color: #4889B4
      .select-img-btn
        background-color: #4889B4
    &.female-theme
      .upload-image-header
        background-color:  #FE706F
      .select-img-btn
        background-color:  #FE706F
    .upload-image-header
      width: 100%
      height: 80px
      .title
        height: 80px
        line-height: 80px
        text-align: center
        color: #fff
        font-size: 14px
      .close-btn
        position: absolute
        width: 25px
        height: 25px
        line-height: 25px
        padding: 5px
        top: 25px
        left: 12px
        color: #fff
        text-align: center
    .upload-image-main
      .img-preview-area
        position: relative
        width: 100%
        height: 150px
        margin-top: 30px
        .no-select-photo
          position: absolute
          top: 0
          left: 50%
          width: 150px
          height: 150px
          line-height: 150px
          margin-left: -75px
          border: 1px dashed #ccc
          color: #ccc
          font-size: 14px
          text-align: center
          &.previewArea-slide-leave-to
            opacity: 0
            transform: translate3d(-100%,0,0)
          &.previewArea-slide-leave-active
            transition: all .4s ease
        .preview-img
          position: absolute
          top: 0
          left: 50%
          display: block
          width: 150px
          height: 150px
          margin-left: -75px
          &.previewArea-slide-enter
            opacity: 0
            transform: translate3d(100%,0,0)
          &.previewArea-slide-enter-to
            opacity: 1
            transform: translate3d(0,0,0)
          &.previewArea-slide-enter-active
            transition: all .4s ease
      .select-img-btn
        position: relative
        width: 150px
        height: 40px
        margin: 30px auto 0 auto
        border-radius: 4px
        text-align: center
        .file-input
          display: inline-block
          width: 100%
          opacity: 0
        .txt
          display: inline-block
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 40px
          line-height: 40px
          color: #fff
          font-size: 14px
      .upload-btn
        width: 150px
        height: 40px
        line-height: 40px
        margin: 30px auto 0 auto
        border-radius: 4px
        background-color: #5cb45d
        text-align: center
        color: #fff
        font-size: 14px
</style>
