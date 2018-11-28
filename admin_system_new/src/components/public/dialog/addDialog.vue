<template>
  <div class="dialog-container" v-show="isShowPub">
    <!-- 弹窗头部信息 -->
    <div>
      <slot name="header"></slot>
    </div>
    <!-- 弹窗内容 -->
    <div>
      <slot name="content"></slot>
    </div>
    <!-- 提交按钮 -->
    <div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "addDialog",
    props: {
      isShowPub: {
        type: Boolean,
        defaultL: false,
        required: true
      }
    },
  }
</script>

<style lang="scss" scoped>
  .dialog-container{
    padding: 0 10px 20px;
    border: 1px solid #99BBE8;
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>
