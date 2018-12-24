<template>
  <div class="list-container">
    <div class="list-bread">
      <div class="list-tit">
        <h1>活动券领取清单</h1>
        <span class="ml10"><Icon type="md-information-circle" />友情提示：取消资格用户会以短信方式告知用户，缴纳的报名费用会退还至用户的玄乐账户。</span>
      </div>
      <div class="list-list">
        <Breadcrumb>
          <BreadcrumbItem to="/actTicketSystem">活动券管理</BreadcrumbItem>
          <BreadcrumbItem>领取清单</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <div class="list-fun mt20">
      <div class="list-ope">
        <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
        <Button icon="ios-cash" type="info" class="ml10" @click="pCancelTic">批量取消</Button>
      </div>
      <div class="list-search">
        <span class="ml15">报名日期从：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="signBeg" :options="begOption" style="width: 200px;"></DatePicker></span>
        <span class="ml15">报名日期止：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" @on-change="signEnd" :options="endOption" style="width: 200px;"></DatePicker></span>
        <span class="ml15">用户姓名：</span>
        <span><Input v-model="signParam.userName" style="width: 200px;"/></span>
        <span class="ml10"><Button icon="ios-search" @click="ticSignListClick">查询</Button></span>
      </div>
    </div>
    <div class="list-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading" highlight-row @on-selection-change="ticSelectedUser"></Table>
      <Page :total="total" :current="signParam.page" v-if="total>10" show-elevator show-total @on-change="signPageChange" class="mt30"/>
    </div>
    <Modal
      title="提示"
      v-model="ticSignTip"
    >
      <p ref="ticSignTip"></p>
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
    name: "actTicketSignList",
    data () {
      return {
        loading:false,
        ticSignTip:false,
        ticUsers:'',//保存批量取消的用户
        //列表查询参数
        signParam:{
          couponId:'',
          page:1,
          rows:10,
          enterTimeStart:'',
          enterTimeEnd:'',
          userName:''
        },
        begOption:{
          disabledDate : date =>  {
            const d = new Date(this.signParam.enterTimeEnd);
            return date && date.valueOf() > d;
          }
        },
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.signParam.enterTimeStart);
            return date && date.valueOf() < d - 24*60*60*1000;
          }
        },
        total:'',
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
            key:'price',
            align:'center'
          },
          {
            title:'家庭住址',
            key:'userAddress',
            align:'center'
          },
          {
            title:'报名渠道',
            key:'enterType',
            align:'center'
          },
          {
            title:'报名日期',
            key:'enterDate',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:200,
            render:(h,params) => {
              if (params.row.status === 1) {
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
                        //console.log(params.row.id);
                        axios.TicketSignCancel({id:params.row.id})
                          .then(res => {
                            this.ticSignTip = true;
                            this.$refs.ticSignTip.innerHTML = res.message;
                            if (res.code === 200) {
                              this.getTicSignList();
                            }
                          })
                          .catch(error => {
                            console.log(error);
                            this.ticSignTip = true;
                            this.$refs.ticSignTip.innerHTML = '取消出错！';
                          })
                      }
                    }
                  }, '取消资格')
                ])
              } else {
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
              }

            }
          }
        ],
        listData:[]
      }
    },
    mounted () {
      this.signParam.couponId = this.$route.query.couponId;
      this.getTicSignList();
    },
    methods:{
      ticSignListClick:function () {
        this.signParam.page = 1;
        this.getTicSignList();
      },
      getTicSignList:function () {
        this.loading= true;
        axios.TicketSignList(this.signParam)
          .then(res => {
            console.log(res.result.list);
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.ticSignTip = true;
              this.$refs.ticSignTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.ticSignTip = true;
            this.$refs.ticSignTip.innerHTML = '获取列表出错！';
          })
      },
      exportData:function () { //导出表格
        window.location.href = base.baseUrl + 'coupon/exportCouponUserList?couponId='+this.signParam.couponId+'&userName='+this.signParam.userName+'&enterTimeStart='+this.signParam.enterTimeStart+'&enterTimeEnd='+this.signParam.enterTimeEnd;
      },
      ticSelectedUser:function (selection) {
        let arr = [];
        selection.forEach(item => {
          arr.push(item.id);
        });
        this.ticUsers = arr.join(',');
        //console.log(this.ticUsers);
      },
      pCancelTic:function () {
        if (this.ticUsers === '') {
          this.ticSignTip = true;
          this.$refs.ticSignTip.innerHTML = '请至少勾选一名用户！';
        } else {
          axios.TicketSignBatchCancel({ids:this.ticUsers})
            .then(res => {
              this.ticSignTip = true;
              this.$refs.ticSignTip.innerHTML = res.message;
              if (res.code === 200) {
                this.ticUsers = '';
                this.getTicSignList();
              }
            })
            .catch(error => {
              console.log(error);
              this.ticSignTip = true;
              this.$refs.ticSignTip.innerHTML = '取消出错！';
            })
        }
      },
      signBeg:function (date) { //查询开始时间
        this.signParam.enterTimeStart = date;
      },
      signEnd:function (date) { //查询结束时间
        this.signParam.enterTimeEnd = date;
      },
      signPageChange:function (page) { //翻页
        this.signParam.page = page;
        this.getTicSignList();
      },
      del:function () {
        this.ticSignTip = false;
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
