<template>
  <div class="list-container content-pad">
    <div class="list-bread">
      <div class="list-tit">
        <h1>节目报名清单</h1>
        <span class="ml10"><Icon type="md-information-circle" />友情提示：取消资格用户会以短信方式告知用户，缴纳的报名费用会退还至用户的玄乐账户。</span>
      </div>
      <div class="list-list">
        <Breadcrumb>
          <BreadcrumbItem to="/act">节目专栏管理</BreadcrumbItem>
          <BreadcrumbItem>报名清单</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <div class="list-fun mt20">
      <div class="list-ope">
        <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        <Button icon="ios-cash" type="info" class="ml10" :loading="cancelLoading" @click="batchCancelSign(actBatchUser,actBatchType,actSignParams.programId)">批量取消</Button>
      </div>
      <div class="list-search">
        <span class="ml15">报名日期从：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="actSignBeg" :options="begOption" class="checkWid"></DatePicker></span>
        <span class="ml15">报名日期止：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="actSignEnd" :options="endOption" class="checkWid"></DatePicker></span>
        <span class="ml15">用户姓名：</span>
        <span><Input v-model="actSignParams.name" class="checkWid"/></span>
        <span class="ml10"><Button icon="ios-search" @click="actSignListClick">查询</Button></span>
      </div>
    </div>
    <div class="list-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading" highlight-row @on-selection-change="actSelectUser"></Table>
      <Page :total="total" :current="actSignParams.pageNum" v-if="total>10" show-elevator show-total @on-change="actSignPageChange" class="mt30"/>
    </div>
    <Modal
      title="提示"
      v-model="actSignTip"
    >
      <p ref="actSignTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "actSignList",
    data () {
      return {
        cancelLoading:false,
        total:'',
        loading:false,
        actSignTip:false,
        actBatchUser:'',
        actBatchType:'',
        //查询参数
        actSignParams:{
          programId:'',
          name:'',
          createTimeStart:'',
          createTimeEnd:'',
          pageNum:1,
          pageSize:10
        },
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.actSignParams.createTimeEnd);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.actSignParams.createTimeStart);
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
                        this.batchCancelSign(params.row.id,params.row.userType,this.actSignParams.programId);
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
      this.actSignParams.programId = this.$route.query.actId;
      this.getActSignList();
    },
    methods :{
      actSignListClick:function () {
        this.actSignParams.pageNum = 1;
        this.getActSignList();
      },
      getActSignList:function () { //查询列表
        this.loading = true;
        axios.ActSignList(this.actSignParams)
          .then(res => {
            //console.log(res.result.list);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.actSignTip = true;
              this.$refs.actSignTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.actSignTip = true;
            this.$refs.actSignTip.innerHTML = '查询出错！';
          })
      },
      exportData :function () { //导出表格
        window.location.href = base.baseUrl.serviceOne + 'column_user/exportProgramUserList?programId='+this.actSignParams.programId+'&name='+this.actSignParams.name+'&createTimeStart='+this.actSignParams.createTimeStart+'&createTimeEnd='+this.actSignParams.createTimeEnd;
      },
      actSignBeg:function (date) { //查询开始时间
        this.actSignParams.createTimeStart = date;
      },
      actSignEnd:function (date) { //查询结束时间
        this.actSignParams.createTimeEnd = date;
      },
      actSelectUser:function (selection) {
        let arr = [];
        let typeArr = [];
        selection.forEach(item => {
          arr.push(item.id);
          typeArr.push(item.userType);
        });
        this.actBatchUser = arr.join(',');
        this.actBatchType = typeArr.join(',');
      },
      batchCancelSign:function (id,type,itemId) { //取消资格
        if (id === '') {
          this.actSignTip = true;
          this.$refs.actSignTip.innerHTML = '请至少勾选一名用户！';
        } else {
          this.cancelLoading = true;
          axios.ActSignCancel({userIds:id,userType:type,itemId:itemId})
            .then(res => {
              this.cancelLoading = false;
              if (res.data === '0') {
                this.actBatchUser = '';
                this.actSignTip = true;
                this.$refs.actSignTip.innerHTML = '取消成功！';
                this.getActSignList();
              } else {
                this.actSignTip = true;
                this.$refs.actSignTip.innerHTML = '取消失败！';
              }
            })
            .catch(error => {
              console.log(error);
              this.cancelLoading = false;
              this.actSignTip = true;
              this.$refs.actSignTip.innerHTML = '取消出错！';
            })
        }
      },
      actSignPageChange:function (page) { //翻页
        this.actSignParams.pageNum = page;
        this.getActSignList();
      },
      del:function () {
        this.actSignTip = false;
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
