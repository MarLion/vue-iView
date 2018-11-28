<template>
  <div class="data-container">
    <div>
      <div class="data-fun">
        <div class="data-ope">
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="data-search">
          <span class="ml15">创建日期从：</span>
          <span><DatePicker type="date" style="width: 200px;"></DatePicker></span>
          <span class="ml15">创建日期止：</span>
          <span><DatePicker type="date" style="width: 200px;"></DatePicker></span>
          <span class="ml15">活动名称：</span>
          <span><Input style="width: 200px;"/></span>
          <span class="ml15">状态类型：</span>
          <span>
            <Select v-model="dataType" style="width:200px" @on-change="selectType">
              <Option v-for="(item,index) in dataList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </span>
          <span class="ml10"><Button icon="ios-search">查询</Button></span>
        </div>
      </div>
      <div class="data-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" v-if="total>10" show-elevator show-total class="mt30"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "act",
    data () {
      return {
        dataType:'',
        dataList:[
          {
            value:'0',
            label:'未开始'
          },
          {
            value:'1',
            label:'已结束'
          }
        ],
        total:100,
        loading:false,
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'节目编号',
            key:'id',
            align:'center'
          },
          {
            title:'节目名称',
            key:'dataName',
            align:'center'
          },
          {
            title:'状态',
            key:'state',
            align:'center'
          },
          {
            title:'报名费',
            key:'fee',
            align:'center'
          },
          {
            title:'报名人数',
            key:'member',
            align:'center'
          },
          {
            title:'节目档期',
            key:'dq',
            align:'center'
          },
          {
            title:'节目开播时间',
            key:'date',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:260,
            render:(h,params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
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
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      // this.remove(params.index)
                    }
                  }
                }, '确认'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path:'/actSignList'})
                    }
                  }
                }, '报名清单')
              ])
            }
          }
        ],
        listData:[
          {
            id:'0001',
            dataName:'退休好生活',
            state:'正常',
            fee:'500',
            member:'300',
            dq:'第28期',
            date:'2018-11-23'
          },
          {
            id:'0001',
            dataName:'退休好生活',
            state:'正常',
            fee:'500',
            member:'300',
            dq:'第28期',
            date:'2018-11-23'
          },
          {
            id:'0001',
            dataName:'退休好生活',
            state:'正常',
            fee:'500',
            member:'300',
            dq:'第28期',
            date:'2018-11-23'
          }
        ],
      }
    },

    methods:{
      selectType:function (t) {

      },
      exportData:function () {

      },
    }
  }
</script>

<style lang="scss" scoped>
  .data-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .data-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .data-list{
    padding-right: 20px;
  }
  .add-title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 20px;
    padding: 10px;
    border-bottom: 1px solid #99BBE8;
    .add-tips{
      font-size: 14px;
    }
    .add-close{
      cursor: pointer;
    }
  }
  .add-image{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .p{
      width: 100px;
      height: 80px;
      line-height: 80px;
      text-align: right;
      padding: 10px 12px 10px 0;
    }
  }
  .demo-upload-list{
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
