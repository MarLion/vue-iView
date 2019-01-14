<template>
  <div class="welcome-container" id="contain">
    <div v-if="users !== 'master'">
      <div class="data-amount">
        <div>
          <span class="bg-1">注册用户总数</span>
          <span class="bg-2">{{userTotal}}</span>
        </div>
        <div>
          <span class="bg-1">订单总数</span>
          <span class="bg-2">{{orderTotal}}</span>
        </div>
        <div>
          <span class="bg-1">红娘服务请求量</span>
          <span class="bg-2">{{atch}}</span>
        </div>
      </div>
      <div class="chart-container mt70">
        <div ref="conOne" class="table"></div>
        <!--<div ref="conTwo" class="table"></div>-->
      </div>
      <div>
        <div ref="conThree" class="table-an"></div>
      </div>
    </div>
    <div v-else>
      <h1 class="mt50">欢迎使用相亲交友后台管理系统</h1>
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
        orderTotal:'',
        atch:''
      }
    },
    mounted () {
      if (sessionStorage.getItem('userName') != null) {
        this.$store.state.admin_token = sessionStorage.getItem('userName');
      }
      if (this.users !== 'master') {
        axios.GetTotalNumber()
          .then(res => {
            //console.log(res);
            this.userTotal = res.data.userSum;
            this.orderTotal = res.data.orderSum;
            this.atch = res.data.atchmakerServiceSum
          })
          .catch(error => {
            console.log(error);
          });
        this.beforeDrawLine();
      }
    },
    computed : {
      users:function () {
        return this.$store.state.admin_token;
      },
    },
    methods:{
      beforeDrawLine:function () {
        let countTime = [];
        let userAccount = [];
        let orderAccount = [];
        let hnAccount = [];
        let pvTime = [];
        let pvCount = [];
        let clcikCount = [];
        axios.GetChartsData({date:this.$trans.getCurrentDate()})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              let count = res.data.count;
              let userPV = res.data.userPV;
              for (let item in count.userCount) {
                countTime.push(item);
                userAccount.push(count.userCount[item]);
              }
              for (let item in count.orderCount) {
                orderAccount.push(count.orderCount[item]);
              }
              for (let item in count.hnServeCount) {
                hnAccount.push(count.hnServeCount[item]);
              }
              for (let item in userPV.userActivity) {
                pvTime.push(item);
                pvCount.push(userPV.userActivity[item]);
              }
              for (let item in userPV.userClicks) {
                clcikCount.push(userPV.userClicks[item]);
              }
              this.drawLine(countTime,userAccount,orderAccount,hnAccount,pvTime,pvCount,clcikCount);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      drawLine:function (arr1,arr2,arr3,arr4,arr7,arr8,arr9) {
        let myChart_1 = echarts.init(this.$refs.conOne);
        let myChart_3 = echarts.init(this.$refs.conThree);
        myChart_1.setOption({
          title:{
           text:'数\n量\n统\n记'
          },
          tooltip: {
            show:true
          },
          legend:{
            data:['用户数量','订单数量','红娘请求数量']
          },
          xAxis: {
            type: 'category',
            boundaryGap : true,
            data: arr1,
            //name:'月份'
          },
          yAxis: {
            type: 'value',
            name:''
          },
            series: [
              {
                name:'用户数量',
                data: arr2,
                type: 'bar'
              },
              {
                name:'订单数量',
                data: arr3,
                type: 'bar'
              },
              {
                name:'红娘请求数量',
                data: arr4,
                type: 'bar'
              },
            ]
        });
        myChart_3.setOption({
          title:{
            text:'用\n户\n统\n记',
          },
          tooltip: {
            show:true
          },
          legend:{
            data:['活跃用户量','用户点击量']
          },
          xAxis: {
            type: 'category',
            boundaryGap : false,
            data: arr7,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name:'活跃用户量',
              data: arr8,
              type: 'line'
            },
            {
              name:'用户点击量',
              data: arr9,
              type: 'line'
            }
          ]
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
.welcome-container{
  padding-bottom: 20px;
  //height: calc(100vh - 64px);
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
    height: 300px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    .table{
      padding: 0 20px;
      height: 100%;
      width: 100%;
    }
  }
  .table-an{
    padding: 0 20px;
    width: 100%;
    height: 300px;
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
