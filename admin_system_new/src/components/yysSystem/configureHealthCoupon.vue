<template>
  <div class="coupon-container content-pad">
    <div class="ticket-fun">
      <div class="ticket-ope">
        <Button type="default" icon="md-add" @click="addCoupon">发布优惠券</Button>
        <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
      </div>
      <div class="ticket-search">
        <span class="ml15">创建日期从：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="couponStart" :options="begOption" class="checkWid"></DatePicker></span>
        <span class="ml15">创建日期止：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="couponEnd" :options="endOption" class="checkWid"></DatePicker></span>
        <span class="ml15">活动券名称：</span>
        <span><Input class="checkWid"/></span>
        <span class="ml15">状态类型：</span>
        <span>
          <Select class="checkWid">
            <Option v-for="(item,index) in couponStaList" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </span>
        <span class="ml10"><Button icon="ios-search" @click="couponClick">查询</Button></span>
      </div>
    </div>
    <div class="ticket-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total class="mt30" @on-change="couPage"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "configureHealthCoupon",
    data () {
      return {
        loading:false,
        total:'',
        listParams:{
          page:1
        },
        listData:[],
        columns:[],
        couponStaList:[
          {
            label:'不限',
            value:0
          },
          {
            label:'有效',
            value:1
          },
          {
            label:'过期',
            value:2
          }
        ],
        begOption:{

        },
        endOption:{

        }
      }
    },
    methods : {
      addCoupon:function () {

      },
      exportData:function () {

      },
      couponStart:function (date) {

      },
      couponEnd:function (date) {

      },
      couponClick:function () {

      },
      couPage:function (page) {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .ticket-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .ticket-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .ticket-list{
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
  .add-detail{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 40px;
    .p{
      width: 100px;
      text-align: right;
      padding: 10px 12px 10px 0;
    }
  }
  .detailSpan{
    padding: 10px 0;
  }
  .detailWidth{
    width: 500px;
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
