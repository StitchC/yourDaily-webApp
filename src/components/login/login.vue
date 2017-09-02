<template>
  <div>
    <button @click="onclick">点击跳转页面</button>
    <button @click="getData">点击请求数据</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import router from '../../router/index.js';

  export default {
    router: router,
    methods: {
      onclick: function() {
        this.$router.push('/user');
      },
      getData: function() {
        this.$http.get('/yourdaily/php/test.php').then((res) => {
          console.log(res.body);
        });
      }
    }
  };
</script>

<style lang="stylus"></style>
