<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
.container{
  padding: 20px;
}
.el-date-editor .el-range-separator{
  width: 8% !important;
}
</style>
