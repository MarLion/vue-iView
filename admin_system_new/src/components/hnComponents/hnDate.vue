<template>
  <div class="data-container" :style="{height: height+'px'}">
    红娘资料上传
  </div>
</template>

<script>
  export default {
    name: "hnDate",
    data () {
      return {
        height:window.innerHeight-64
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
