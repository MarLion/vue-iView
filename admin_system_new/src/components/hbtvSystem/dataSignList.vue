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
        <Button icon="ios-cash" type="info" class="ml10" @click="cancelRight(batchUser,batchType)">批量取消</Button>
      </div>
      <div class="list-search">
        <span class="ml15">报名日期从：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="paramStart" :options="begOption" style="width: 200px;"></DatePicker></span>
        <span class="ml15">报名日期止：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="paramEnd" :options="endOption" style="width: 200px;"></DatePicker></span>
        <span class="ml15">用户姓名：</span>
        <span><Input v-model="listParams.name" style="width: 200px;"/></span>
        <span class="ml10"><Button icon="ios-search" @click="enCheckClickData">查询</Button></span>
      </div>
    </div>
    <div class="list-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading" highlight-row @on-selection-change="selectUser"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total @on-change="pageChangeDataEn" class="mt30"/>
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
    name: "dataSignList",
    data () {
      return {
        total:'',
        loading:false,
        cancelTip:false,
        batchUser:'',//保存批量取消用户
        batchType:'',//保存批type
        //条件查询参数
        listParams:{
          activityId:'',
          name:'',
          createTimeStart:'',
          createTimeEnd:'',
          pageNum:1,
          pageSize:10
        },
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.createTimeEnd);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.createTimeStart);
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
            key:'name',
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
            key:'createDate',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:200,
            render:(h,params) => {
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
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.cancelRight(params.row.id,params.row.userType);
                      }
                    }
                  }, '取消资格')
                ])
              }
            }
          }
        ],
        listData:[]
      }
    },
    mounted () {
      this.listParams.activityId = this.$route.query.activityId;
      this.getDataEnList();
    },
    methods :{
      enCheckClickData:function () {
        this.listParams.page = 1;
        this.getDataEnList();
      },
      getDataEnList:function () {
        this.loading = true;
        axios.BlindDateSignList(this.listParams)
          .then(res => {
            //console.log(res.result.list);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.cancelTip = true;
              this.$refs.cancelTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.cancelTip = true;
            this.$refs.cancelTip.innerHTML = '查询出错';
          })
      },
      exportData :function () {
        window.location.href = base.baseUrl + 'activity_user/exportActivityUserList?activityId='+this.listParams.activityId+'&name='+this.listParams.name+'&createTimeStart='+this.listParams.createTimeStart+'&createTimeEnd='+this.listParams.createTimeEnd;
      },
      selectUser:function (selection) {
        let userArr = [];
        let typeArr = [];
        selection.forEach(item => {
          userArr.push(item.id);
          typeArr.push(item.userType);
        });
        this.batchUser = userArr.join(',');
        this.batchType = typeArr.join(',');
        //console.log(this.batchUser);
      },
      cancelRight:function (id,type) {
        if (id === '') {
          this.cancelTip = true;
          this.$refs.cancelTip.innerHTML = '请至少勾选一名用户！';
        } else {
          axios.BlindDateCancelEn({userIds:id,userType:type})
            .then(res => {
              //console.log(res);
              if (res.data === '0') {
                this.batchUser = '';
                this.cancelTip = true;
                this.$refs.cancelTip.innerHTML = '取消成功！';
                this.getDataEnList();
              } else {
                this.cancelTip = true;
                this.$refs.cancelTip.innerHTML = '取消失败！';
              }
            })
            .catch(error => {
              console.log(error);
              this.cancelTip = true;
              this.$refs.cancelTip.innerHTML = '取消出错！';
            })
        }
      },
      del:function () {
        this.cancelTip = false;
      },
      pageChangeDataEn:function (page) {
        this.listParams.pageNum = page;
        this.getDataEnList();
      },
      paramStart:function (date) {
        this.listParams.createTimeStart = date;
      },
      paramEnd:function (date) {
        this.listParams.createTimeEnd = date;
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
