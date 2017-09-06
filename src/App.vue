<template>
  <div id="app">
    <transition :name="transitionName" mode="in-out">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data: function() {
      return {
        transitionName: 'router-slide'
      };
    },
    watch: {
      '$route': function(to, from) {
        let toPath = to.path;
        if(toPath === '/user') {
          this.transitionName = 'router-fade';
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .router-slide-leave-to
    transform: translate3d(100%,0,0)
  .router-slide-leave-active
    transition: all ease .4s
  .router-slide-enter
    transform: translate3d(100%,0,0)
  .router-slide-enter-active
    transition: all ease .4s
  .router-slide-enter-to
    transform: translate3d(0,0,0)


  .router-fade-leave-to
    opacity: 0
  .router-fade-leave-active
    transition: all ease .5s
  .router-fade-enter
    opacity: 1
</style>
