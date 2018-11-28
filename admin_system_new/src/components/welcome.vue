<template>
  <div class="welcome-container" id="contain">
    <div ref="conOne" class="table"></div>
    <div ref="conTwo" class="table"></div>
    <div ref="conThree" class="table"></div>
  </div>
</template>

<script>
  //全局加载体积过大 按需加载
  let echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/line');
  require('echarts/lib/chart/bar');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/legend');
  export default {
    name: "welcome",
    mounted () {
      this.drawLine();
    },
    methods:{
      drawLine:function () {
        let myChart_1 = echarts.init(this.$refs.conOne);
        let myChart_2 = echarts.init(this.$refs.conTwo);
        let myChart_3 = echarts.init(this.$refs.conThree);
        myChart_1.setOption({
          title:{
           text:'用户数量折线图'
          },
          tooltip: {
            show:true
          },
          legend:{
            data:['用户数量']
          },
          xAxis: {
            type: 'category',
            boundaryGap : false,
            data: ['五月', '六月', '七月', '八月', '九月', '十月', '十一月'],
            name:'月份'
          },
          yAxis: {
            type: 'value',
            name:'用户数'
          },
          series: [{
            name:'用户数量',
            data: [23000, 36000, 50000, 49000, 62000, 37000, 100000],
            type: 'line'
          }]
        });
        myChart_2.setOption({
          title:{
            text:'订单柱状图'
          },
          tooltip: {
            show:true
          },
          legend:{
            data:['订单数量']
          },
          xAxis: {
            type: 'category',
            data: ['五月', '六月', '七月', '八月', '九月', '十月', '十一月'],
            name:'月份'
          },
          yAxis: {
            type: 'value',
            name:'订单'
          },
          series: [{
            name:'订单数量',
            data: [23000, 36000, 50000, 49000, 62000, 37000, 100000],
            type: 'bar'
          }]
        });
        myChart_3.setOption({
          title:{
            text:'现金流折线图'
          },
          tooltip: {
            show:true
          },
          legend:{
            data:[{
              name:'现金流'
            }]
          },
          xAxis: {
            type: 'category',
            boundaryGap : false,
            data: ['五月', '六月', '七月', '八月', '九月', '十月', '十一月'],
            name:'月份'
          },
          yAxis: {
            type: 'value',
            name:'现金数'
          },
          series: [{
            name:'现金流',
            data: [23000, 36000, 50000, 49000, 62000, 37000, 100000],
            type: 'line'
          }]
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
 .welcome-container{
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: row;
   justify-content: space-around;
   flex-wrap: wrap;
   .table{
     height: 40%;
     width: 40%;
   }
 }
</style>
