<template>
  <div>
    <p>我是 user</p>
    <div>
      <router-link to="/user/daily">日记</router-link>
      <router-link to="/user/calendar">日历</router-link>
      <router-link to="/user/self">我</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {};
</script>

<style lang="stylus"></style>
