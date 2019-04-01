<template>
  <div class="list-container content-pad">
    <div class="list-bread">
      <div class="list-tit">
        <h1>旅游报名清单</h1>
        <span class="ml10"><Icon type="md-information-circle" />友情提示：取消资格用户会以短信方式告知用户，缴纳的报名费用会退还至用户的玄乐账户。</span>
      </div>
      <div class="list-list">
        <Breadcrumb>
          <BreadcrumbItem to="/tourRouteSystem">旅游路线管理</BreadcrumbItem>
          <BreadcrumbItem>报名清单</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <div class="list-fun mt20">
      <div class="list-ope">
        <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        <Button icon="ios-cash" type="info" class="ml10" @click="cancelBatch" :loading="canceling">批量取消</Button>
      </div>
      <div class="list-search">
        <span class="ml15">报名日期从：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="enStartTime" :options="begOption" class="checkWid"></DatePicker></span>
        <span class="ml15">报名日期止：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="enEndTime" :options="endOption" class="checkWid"></DatePicker></span>
        <span class="ml15">用户姓名：</span>
        <span><Input v-model="userName" class="checkWid"/></span>
        <span class="ml10"><Button icon="ios-search" @click="enCheckClick">查询</Button></span>
      </div>
    </div>
    <div class="list-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading" highlight-row @on-selection-change="changeSelect"></Table>
      <Page :total="total" :current="page" v-if="total>10" show-elevator show-total class="mt30" @on-change="pageChangeEn"/>
    </div>
    <Modal
      title="提示"
      v-model="cancelTip"
    >
      <p ref="cancelTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import * as base from '../../axios/base'
  export default {
    name: "tourSignList",
    data () {
      return {
        queryId:'',
        total:'',
        startTime:'',
        endTime:'',
        userName:'',
        page:1,
        pageSize:10,
        loading:false,
        cancelTip:false,
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.endTime);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.startTime);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        columns:[
          {
            type: 'selection',
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
            title:'手机号码',
            key:'phone',
            align:'center'
          },
          {
            title:'报名费（元）',
            key:'amount',
            align:'center'
          },
          {
            title:'家庭住址',
            key:'address',
            align:'center'
          },
          {
            title:'报名渠道',
            key:'typeText',
            align:'center'
          },
          {
            title:'报名日期',
            key:'createTime',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:200,
            render:(h,params) => {
              //状态为0 正常 状态为1 已取消资格
              if (params.row.status == '1') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled:true
                    },
                    style: {
                      marginRight: '5px'
                    }
                  }, '已取消资格')
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      disabled:false
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        axios.CancleTourEn({tourUserId:params.row.id,itemId:this.queryId})
                          .then(res => {
                            console.log(res);
                            if (res.data === "0") {
                              this.cancelTip = true;
                              this.$refs.cancelTip.innerHTML = '取消成功！';
                              this.getEnlist();
                            }
                          })
                          .catch(error => {
                            console.log(error)
                          })
                      }
                    }
                  }, '取消资格')
                ])
              }
            }
          }
        ],
        listData:[],
        batchStr:'',
        canceling:false
      }
    },
    mounted () {
      this.queryId =  this.$route.query.tourId;
      this.getEnlist();
    },
    methods :{
      enCheckClick:function () {
        this.page = 1;
        this.getEnlist();
      },
      getEnlist:function () {
        this.loading = true;
        axios.TourEnlist({
          tourId:this.queryId,
          startTime:this.startTime,
          endTime:this.endTime,
          userName:this.userName,
          pageNum:this.page,
          pageSize: this.pageSize
        })
          .then(res => {
            //console.log(JSON.stringify(res));
            this.loading = false;
            this.listData = res.rows;
            this.total = res.total;
          })
          .catch(error => {
            console.log(error);
            this.cancelTip = true;
            this.$refs.cancelTip.innerHTML = '查询出错！';
          })
      },
      exportData :function () {
        window.location.href = base.baseUrl.serviceOne + 'tour_user/exportTourUserList?tourId='+this.queryId+'&startTime='+this.startTime+'&endTime='+this.endTime+'&userName='+this.userName;
      },
      enStartTime:function (date) {
        this.startTime = date;
      },
      enEndTime:function (date) {
        this.endTime = date;
      },
      pageChangeEn:function (page) {
        this.page = page;
        this.getEnlist();
      },
      changeSelect:function (selection) {
        let idArr = [];
        selection.forEach(item => {
          idArr.push(item.id);
        });
        this.batchStr = idArr.join(',');
      },
      cancelBatch:function () {
        if (this.batchStr == "") {
          this.cancelTip = true;
          this.$refs.cancelTip.innerHTML = '请至少勾选一名人员！';
        } else {
          this.canceling = true;
          axios.CancleTourEnBatch({tourUserIds:this.batchStr,itemId:this.queryId})
            .then(res => {
              //console.log(res);
              this.canceling = false;
              if (res.data === '0') {
                this.batchStr = '';
                this.cancelTip = true;
                this.$refs.cancelTip.innerHTML = '取消成功！';
                this.getEnlist();
              } else {
                this.cancelTip = true;
                this.$refs.cancelTip.innerHTML = '取消失败！';
              }
            })
            .catch(error => {
              console.log(error);
              this.cancelTip = true;
              this.$refs.cancelTip.innerHTML = '后台出错！';
              this.canceling = false;
            })
        }
      },
      del:function () {
        this.cancelTip = false;
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
