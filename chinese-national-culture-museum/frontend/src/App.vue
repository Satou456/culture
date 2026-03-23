<script setup>
</script>

<template>
  <router-view></router-view>
</template>

<style>
  /* 注意：这里不使用 scoped，以便样式全局生效 */

  /* 重置默认样式 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    background-color: #f5f7fa; /* 可选：设置一个默认背景色 */
  }

  #app {
    width: 100%;
    height: 100%;
  }
</style>
