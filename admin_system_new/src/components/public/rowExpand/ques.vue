<template>
  <div class="ques-container">
    <Row class="expand-row" v-for="item in row" :key="item.id">
      <Col>
        {{item.content}}
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "ques",
    props: {
      row: Array
    }
  }
</script>

<style lang="scss" scoped>
  .expand-row{
    margin-bottom: 16px;
    text-align: left;
    padding-left: 50px;
  }
</style>
