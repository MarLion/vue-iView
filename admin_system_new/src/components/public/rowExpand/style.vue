<template>
  <div class="style-container">
    <Row class="expand-row">
      <Col span="6" v-for="item in row" :key="item.id" class="mt10 flex">
        <p class="tit">{{item.name}}：</p>
        <img :src="item.picPath"/>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "classStyle",
    props: {
      row: Array
    }
  }
</script>

<style lang="scss" scoped>
  .expand-row{
    margin-bottom: 16px;
    text-align: left;
  }
  .flex{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .tit{
    width: 80px;
    text-align: right;
    height: 100px;
    line-height: 100px;
  }
  img{
    display: inline-block;
    height: 100px;
    margin-left: 5px;
  }
</style>
