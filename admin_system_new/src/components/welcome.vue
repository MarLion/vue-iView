<template>
  <div class="welcome-container" id="contain">
    <div class="data-amount">
      <div>
        <span class="bg-1">用户总数</span>
        <span class="bg-2">{{userTotal}}</span>
      </div>
      <div>
        <span class="bg-1">订单总数</span>
        <span class="bg-2">{{orderTotal}}</span>
      </div>
    </div>
    <div class="chart-container mt70">
      <div ref="conOne" class="table"></div>
      <div ref="conTwo" class="table"></div>
    </div>
    <div>
      <div ref="conThree" class="table-an"></div>
    </div>
  </div>
</template>

<script>
  //全局加载体积过大 按需加载
  import axios from '../../src/axios/axios'
  import Operation from "iview/src/components/transfer/operation";
  let echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/line');
  require('echarts/lib/chart/bar');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/legend');
  export default {
    name: "welcome",
    components: {Operation},
    data () {
      return {
        userTotal:'',
        orderTotal:''
      }
    },
    mounted () {
      axios.GetTotalNumber()
        .then(res => {
          //console.log(res);
          this.userTotal = res.data.userSum;
          this.orderTotal = res.data.orderSum;
        })
        .catch(error => {
          console.log(error);
        });
      this.beforeDrawLine();
    },
    methods:{
      beforeDrawLine:function () {
        let countTime = [];
        let userAccount = [];
        let orderAccount = [];
        let growthTime = [];
        let userGrowth = [];
        let orderGrowth = [];
        let pvTime = [];
        let pvCount = [];
        axios.GetChartsData({date:this.$trans.getCurrentDate()})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              let count = res.data.count;
              let growthRate = res.data.growthRate;
              let userPV = res.data.userPV;
              for (let item in count.userCount) {
                countTime.push(item);
                userAccount.push(count.userCount[item]);
              }
              for (let item in count.orderCount) {
                orderAccount.push(count.orderCount[item]);
              }
              for (let item in growthRate.userStatistics) {
                growthTime.push(item);
                userGrowth.push(growthRate.userStatistics[item]);
              }
              for (let item in growthRate.orderStatistics) {
                orderGrowth.push(growthRate.orderStatistics[item]);
              }
              for (let item in userPV) {
                pvTime.push(item);
                pvCount.push(userPV[item]);
              }
              this.drawLine(countTime,userAccount,orderAccount,growthTime,userGrowth,orderGrowth,pvTime,pvCount);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      drawLine:function (arr1,arr2,arr3,arr4,arr5,arr6,arr7,arr8) {
        let myChart_1 = echarts.init(this.$refs.conOne);
        let myChart_2 = echarts.init(this.$refs.conTwo);
        let myChart_3 = echarts.init(this.$refs.conThree);
        myChart_1.setOption({
          title:{
           text:'数量'
          },
          tooltip: {
            show:true
          },
          legend:{
            data:['用户数量','订单数量']
          },
          xAxis: {
            type: 'category',
            boundaryGap : false,
            data: arr1,
            //name:'月份'
          },
          yAxis: {
            type: 'value',
            name:'用户数'
          },
            series: [
              {
                name:'用户数量',
                data: arr2,
                type: 'line'
              },
              {
                name:'订单数量',
                data: arr3,
                type: 'line'
              },
            ]
        });
        myChart_2.setOption({
          title:{
            text:'增长率'
          },
          tooltip: {
            show:true
          },
          legend:{
            data:['用户增长率','订单增长率']
          },
          xAxis: {
            type: 'category',
            boundaryGap : false,
            data: arr4,
            //name:'月份'
          },
          yAxis: {
            type: 'value',
            name:'%百分比'
          },
          series: [
            {
              name:'用户增长率',
              data: arr5,
              type: 'line'
            },
            {
              name:'订单增长率',
              data: arr6,
              type: 'line'
            }
          ]
        });
        myChart_3.setOption({
          title:{
            text:'本月用户访问量'
          },
          tooltip: {
            show:true
          },
          legend:{
            data:[{
              name:'访问量'
            }]
          },
          xAxis: {
            type: 'category',
            boundaryGap : false,
            data: arr7,
            //name:'星期'
          },
          yAxis: {
            type: 'value',
            //name:'访问量'
          },
          series: [{
            name:'访问量',
            data: arr8,
            type: 'line'
          }]
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
.welcome-container{
  height: 100%;
  .data-amount,.data-add{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    color: #ffffff;
    width: 90%;
    margin: 30px auto 0;
    div{
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      span{
        display: inline-block;
      }
    }
  }
  .chart-container{
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    .table{
      height: 100%;
      width: 40%;
    }
  }
  .table-an{
    width: 100%;
    height: 400px;
  }
}
.bg-1{
  width: 100px;
  height: 80px;
  background-color: #CA7A74;
  line-height: 80px;
  border-radius: 5px 0 0 5px;
}
.bg-2{
  width: 100px;
  height: 80px;
  background-color: #BAD7C7;
  line-height: 80px;
  border-radius: 0 5px 5px 0;
}
  .data-tit{
    height: 50px;
    line-height: 50px;
    background-color: #B03A5B;
    width: 70px;
    border-radius: 5px;
  }
</style>
