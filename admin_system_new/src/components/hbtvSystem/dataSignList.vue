<template>
  <div class="list-container">
    <div class="list-bread">
      <div class="list-tit">
        <h1>相亲活动报名清单</h1>
        <span class="ml10"><Icon type="md-information-circle" />友情提示：取消资格用户会以短信方式告知用户，缴纳的报名费用会退还至用户的玄乐账户。</span>
      </div>
      <div class="list-list">
        <Breadcrumb>
          <BreadcrumbItem to="/dataPageSystem">相亲专栏管理</BreadcrumbItem>
          <BreadcrumbItem>报名清单</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <div class="list-fun mt20">
      <div class="list-ope">
        <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        <Button icon="ios-cash" type="info" class="ml10">批量取消</Button>
      </div>
      <div class="list-search">
        <span class="ml15">报名日期从：</span>
        <span><DatePicker type="date" style="width: 200px;"></DatePicker></span>
        <span class="ml15">报名日期止：</span>
        <span><DatePicker type="date" style="width: 200px;"></DatePicker></span>
        <span class="ml15">用户姓名：</span>
        <span><Input style="width: 200px;"/></span>
        <span class="ml10"><Button icon="ios-search">查询</Button></span>
      </div>
    </div>
    <div class="list-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total class="mt30"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "dataSignList",
    data () {
      return {
        total:100,
        loading:false,
        columns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title:'用户编号',
            key:'number',
            align:'center'
          },
          {
            title:'姓名',
            key:'name',
            align:'center'
          },
          {
            title:'手机号码',
            key:'phone',
            align:'center'
          },
          {
            title:'报名费',
            key:'fee',
            align:'center'
          },
          {
            title:'家庭住址',
            key:'address',
            align:'center'
          },
          {
            title:'报名渠道',
            key:'method',
            align:'center'
          },
          {
            title:'报名日期',
            key:'date',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:200,
            render:(h,params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.log(params.index);
                    }
                  }
                }, '取消资格')
              ])
            }
          }
        ],
        listData:[
          {
            number:'123456789',
            name:'王浩',
            phone:'14589555487',
            fee:'500',
            address:'洪山区中南路555号',
            method:'玄乐App',
            date:'2018-11-25'
          },
          {
            number:'123456789',
            name:'王浩',
            phone:'14589555487',
            fee:'500',
            address:'洪山区中南路555号',
            method:'玄乐App',
            date:'2018-11-25'
          },
          {
            number:'123456789',
            name:'王浩',
            phone:'14589555487',
            fee:'500',
            address:'洪山区中南路555号',
            method:'玄乐App',
            date:'2018-11-25'
          }
        ]
      }
    },
    methods :{
      exportData :function () {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-bread{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .list-tit{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    h1{
      text-align: left;
    }
    span{
      height: 36px;
      line-height: 36px;
    }
  }
  .list-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .list-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .list-list{
    padding-right: 20px;
  }
</style>
