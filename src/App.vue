<template>
  <div id="app">
    <transition name="router-change" mode="in-out">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .router-change-leave-to
    transform: translate3d(100%,0,0)
  .router-change-leave-active
    transition: all ease .4s
  .router-change-enter
    transform: translate3d(100%,0,0)
  .router-change-enter-active
    transition: all ease .4s
  .router-change-enter-to
    transform: translate3d(0,0,0)
</style>
