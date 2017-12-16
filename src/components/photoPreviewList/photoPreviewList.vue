<template>
  <transition name="swiper-fade">
    <div class="mySwipe-wrap" v-show="show">
      <swiper :options="swipeOption" ref="mySwiper">
        <swiper-slide v-for="(image, index) in imagesList" :key="index">
          <img :src="image" @click="imageWipeHide">
        </swiper-slide>
      </swiper>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {swiper, swiperSlide} from 'vue-awesome-swiper';
  /*
  * 图片列表预览组件
  * @param {Array} images - 保存预览图片的内容
  * @param {Number} imagesShowIndex - 设置swiper 从第几个item 开始显示
  * @param {Boolean} show - 控制图片预览组件的显示和隐藏
  *
  *
  * @event photo-preview-list-hide 触发父组建事件 隐藏组件
  *
  * */
  export default {
    data: function() {
      return {
        swipeOption: {
          autoplay: 0,
          direction: 'horizontal',
          setWrapperSize: true
        }
      };
    },
    props: {
      imagesList: {
        type: Array
      },
      imagesShowIndex: {
        type: Number
      },
      show: {
        type: Boolean
      }
    },
    components: {
      'swiper': swiper,
      'swiper-slide': swiperSlide
    },
    methods: {
      imageWipeHide: function() {
        this.$emit('photo-preview-list-hide');
      }
    },
    watch: {
      imagesShowIndex: function(val) {
        this.$refs.mySwiper.swiper.slideTo(val, 300, false);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .mySwipe-wrap
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0,0,0,0.8)
    z-index: 80
    &.swiper-fade-enter
      opacity: 0
    &.swiper-fade-enter-active
      transition: all .4s linear
    &.swiper-fade-enter-to
      opacity: 1
    &.swiper-fade-leave-to
      opacity: 0
    &.swiper-fade-leave-active
      transition: all .4s linear
    .swiper-container
      height: 100%
    .swiper-wrapper
      display: flex
      align-items: center
      height: 100%
      .swiper-slide
        img
          width: 100%
</style>
