<template>
  <div class="scroll-view-wrap" ref="scroll">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BetScroll from 'better-scroll';

  /**
   * 滚动视图组件
   *
   * @params {Object} content - 滚动视图的内容，视图会检测数据的变化刷新滚动组件
   * @params {Object} options - 配置 better-scroll 的选项
   *
   * */
  export default {
    props: {
      content: {
        default: () => {
          return [];
        }
      },
      options: {
        type: Object,
        default: () => {
          return {
            click: true,
            probeType: 3
          };
        }
      }
    },
    mounted() {
      this.betScroll = new BetScroll(this.$refs.scroll, this.options);
      // 滚动视图组件发生touchend 事件后触发父组件事件
      this.betScroll.on('touchend', (pos) => {
        this.$emit('ontouchend', pos);
      });
    },
    methods: {
      // 暴露一些组件的方法
      refresh() {
        this.betScroll.refresh();
      }
    },
    watch: {
      content() {
        setTimeout(() => {
          this.refresh();
        }, 20);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .scroll-view-wrap
    width: 100%
    height: 100%
</style>
