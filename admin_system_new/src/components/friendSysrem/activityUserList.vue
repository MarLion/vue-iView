<template>
    <div class="list-container content-pad">
      <div class="list-bread">
        <div class="list-tit">
          <h1>活动报名清单</h1>
        <div class="list-list">
          <Breadcrumb>
            <BreadcrumbItem to="/activitySystem">活动管理</BreadcrumbItem>
            <BreadcrumbItem>报名清单</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      <div class="list-fun mt20">
        <div class="list-ope">
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        </div>
        <div class="list-search">
          <span class="ml15">报名日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="startTime" class="checkWid"></DatePicker></span>
          <span class="ml15">报名日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="endTime" class="checkWid"></DatePicker></span>
          <span class="ml15">用户姓名：</span>
          <span><Input v-model="listParams.userName" class="checkWid"/></span>
          <span class="ml10"><Button icon="ios-search" @click="getAyUserEnlist">查询</Button></span>
        </div>
      </div>
      <div class="list-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading" highlight-row></Table>
        <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="pageChangeDataEn" class="mt30"/>
      </div>
      <Modal
        title="提示"
        v-model="userTip"
        :mask-closable = "false"
      >
        <p ref="userTip"></p>
        <div slot="footer">
          <Button type="info"  @click="del">确定</Button>
        </div>
      </Modal>
    </div>
    </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "activityUserList",
    data () {
      return {
        userTip:false,
        loading:false,
        total:'',
        listParams:{
          actId:'',
          userName:'',
          applyTimeStart:'',
          applyTimeEnd:'',
          page:1,
          size:10
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'用户编号',
            key:'userId',
            align:'center'
          },
          {
            title:'姓名',
            key:'userName',
            align:'center'
          },
          {
            title:'个性签名',
            key:'sign',
            align:'center'
          },
          {
            title:'个人介绍',
            key:'description',
            align:'center'
          },
          {
            title:'用户状态',
            key:'userStatusName',
            align:'center'
          },
          {
            title:'加入日期',
            key:'joinTime',
            align:'center'
          }
        ],
      }
    },
    mounted () {
      this.listParams.actId = this.$route.query.actId;
      this.getUserList();
    },
    methods:{
      getUserList:function () {
        axios.ActivityUserList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify( res.result.list));
            if (res.code === 200) {
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.userTip = true;
              this.$refs.userTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.userTip = true;
            this.$refs.userTip.innerHTML = '查询出错！'
          })
      },
      exportData:function () {
        window.location.href = base.baseUrl.serviceTwo + 'activity/exportActUserList?actId='+this.listParams.actId+'&userName='+this.listParams.userName+'&applyTimeStart='+this.listParams.applyTimeStart+'&applyTimeEnd='+this.listParams.applyTimeEnd;
      },
      startTime:function (date) {
        this.listParams.applyTimeStart = date;
      },
      endTime:function (date) {
        this.listParams.applyTimeEnd = date;
      },
      getAyUserEnlist:function () {
        this.listParams.page = 1;
        this.getUserList();
      },
      pageChangeDataEn:function (page) {
        this.listParams.page = page;
        this.getUserList();
      },
      del:function () {
        this.userTip = false;
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
