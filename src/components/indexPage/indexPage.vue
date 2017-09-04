<template>
  <div class="index-wrapper">
    <div class="logo">
      <img src="./appLogo.png" class="logo-icon">
      <slot name="page-title"></slot>
    </div>
    <slot name="input-group"></slot>
    <slot name="btn-group"></slot>
  </div>
</template>

<script type="text/ecmascript-6">

</script>

<style lang="stylus" rel="stylesheet/stylus">
  .index-wrapper
    width: 100%
    height: 100%
    padding-top: 1px
    background-color: #5AABDE
    .logo
      margin-top: 35%
      text-align: center
      .logo-icon
        width: 88px
    input
      text-align: center
      color: rgba(255,255,255,0.8)
      background-color: rgba(255,255,255,0)
      &:focus
        outline: none
</style>
