<template>
    <div class="list-container content-pad">
      <div class="list-bread">
        <div class="list-tit">
          <h1>圈子用户清单</h1>
          <!--<span class="ml10"><Icon type="md-information-circle" />友情提示：取消资格用户会以短信方式告知用户，缴纳的报名费用会退还至用户的玄乐账户。</span>-->
        </div>
        <div class="list-list">
          <Breadcrumb>
            <BreadcrumbItem to="/communitySystem">圈子管理</BreadcrumbItem>
            <BreadcrumbItem>用户清单</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      <div class="list-fun mt20">
        <div class="list-ope">
          <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
          <!--<Button icon="ios-cash" type="info" class="ml10" @click="cancelBatch" :loading="canceling">批量取消</Button>-->
        </div>
        <div class="list-search">
          <span class="ml15">报名日期从：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="startTime" class="checkWid"></DatePicker></span>
          <span class="ml15">报名日期止：</span>
          <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="endTime" class="checkWid"></DatePicker></span>
          <span class="ml15">用户姓名：</span>
          <span><Input v-model="userParams.userName" class="checkWid"/></span>
          <span class="ml10"><Button icon="ios-search" @click="getUserEnlist">查询</Button></span>
        </div>
      </div>
      <div class="list-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading" highlight-row @on-selection-change="selectUser"></Table>
        <Page :total="total" :current="userParams.page" v-if="total>10" show-elevator show-total @on-change="pageChangeDataEn" class="mt30"/>
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
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "communityUserList",
    data () {
      return {
        total:100,
        loading:false,
        userTip:false,
        userParams:{
          communityId:'',
          userName:'',
          joinTimeStart:'',
          joinTimeEnd:'',
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
            title:'进圈日期',
            key:'joinTime',
            align:'center'
          }
        ],
      }
    },
    mounted () {
      this.userParams.communityId = this.$route.query.communityId;
      this.getUserList();
    },
    methods:{
      getUserList:function () {
        this.loading = true;
        axios.CommunityUserList(this.userParams)
          .then(res => {
            console.log(res);
            if (res.code === 200) {
              this.loading = false;
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
      getUserEnlist:function () {
        this.userParams.page = 1;
        this.getUserList();
      },
      exportData:function () {
        window.location.href = base.baseUrl.serviceTwo + 'community/exportCommunityUserList?communityId='+this.userParams.communityId+'&userName='+this.userParams.userName+'&joinTimeStart='+this.userParams.joinTimeStart+'&joinTimeEnd='+this.userParams.joinTimeEnd;
      },
      startTime:function (date) {
        this.userParams.joinTimeStart = date;
      },
      endTime:function (date) {
        this.userParams.joinTimeEnd = date;
      },
      selectUser:function () {

      },
      pageChangeDataEn:function (page) {
        console.log(page);
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
