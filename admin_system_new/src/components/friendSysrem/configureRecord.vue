<template>
  <div class="record-container content-pad">
    <div class="community-fun">
      <div class="community-search">
        <span class="ml15">用户名：</span>
        <span><Input v-model="listParams.userName" class="checkWid"/></span>
        <span class="ml15">创建日期从：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" v-model="listParams.createTimeStart" @on-change="chooseStartTime" class="checkWid"></DatePicker></span>
        <span class="ml15">创建日期止：</span>
        <span><DatePicker type="date" format="yyyy-MM-dd" v-model="listParams.createTimeEnd" @on-change="chooseEndTime" :options="endOption" class="checkWid"></DatePicker></span>
        <span class="ml10"><Button icon="ios-search" @click="checkUser">查询</Button></span>
      </div>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="userPageChange" class="mt30"/>
    </div>
    <Drawer
      title="查看履历"
      v-model="recordValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearData"
    >
      <Table border :columns="eduColumns" :data="eduListData" :loading="recordLoading"></Table>
      <Table border :columns="workColumns" :data="workListData" :loading="recordLoading" class="mt50"></Table>
      <Table border :columns="pyColumns" :data="pyListData" :loading="recordLoading" class="mt50"></Table>
    </Drawer>
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
  export default {
    name: "configureRecord",
    data () {
      return {
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        recordValue:false,
        recordLoading:false,
        loading:false,
        userTip:false,
        total:'',
        listParams:{
          userName:'',
          createTimeStart:'',
          createTimeEnd:'',
          page:1,
          size:10
        },
        listData:[],
        eduListData:[],
        workListData:[],
        pyListData:[],
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
            title:'用户姓名',
            key:'userName',
            align:'center'
          },
          {
            title:'年龄',
            key:'age',
            align:'center'
          },
          {
            title:'性别',
            key:'gender',
            align:'center'
          },
          {
            title:'创建时间',
            key:'createTime',
            align:'center'
          },
          {
            title:'操作选项',
            key:'action',
            align:'center',
            width:120,
            render:(h,params) => {
              return h('div',[
                h('Button',{
                  props:{
                    type: 'success',
                    size: 'small'
                  },
                  style:{
                    marginRight:'5px'
                  },
                  on:{
                    click:() => {
                      this.recordValue = true;
                      this.recordLoading = true;
                      axios.UserRecord({userId:params.row.userId})
                        .then(res => {
                          //console.log(res);
                          if (res.code === 200) {
                            this.recordLoading = false;
                            this.eduListData = res.result.edList;
                            this.workListData = res.result.workList;
                            this.pyListData = res.result.pyList;
                          } else {
                            this.userTip = true;
                            this.$refs.userTip.innerHTML = res.message;
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.userTip = true;
                          this.$refs.userTip.innerHTML = '查询履历出错！'
                        })
                    }
                  }
                },'查看履历')
              ])
            }
          }
        ],
        eduColumns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'教育履历',
            key:'lifeName',
            align:'center'
          },
          {
            title:'证明人',
            key:'referenceName',
            align:'center'
          },
        ],
        workColumns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'工作履历',
            key:'lifeName',
            align:'center'
          },
          {
            title:'证明人',
            key:'referenceName',
            align:'center'
          },
        ],
        pyColumns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'个人三观',
            key:'lifeName',
            align:'center'
          },
          {
            title:'证明人',
            key:'referenceName',
            align:'center'
          },
        ],
        endOption:{
          disabledDate : date =>  {
            const d = new Date(this.listParams.createTimeStart);
            return date && date.valueOf() < d;
          }
        },
      }
    },
    mounted () {
      this.getUserList();
    },
    methods:{
      getUserList:function () {
        this.loading = true;
        axios.UserList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.result.list[0]));
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
            this.$refs.userTip.innerHTML = '查询出错！';
          })
      },
      checkUser:function () {
        this.listParams.page = 1;
        this.getUserList();
      },
      userPageChange:function (page) {
        this.listParams.page = page;
        this.getUserList();
      },
      chooseStartTime:function (date) {
       this.listParams.createTimeStart = date;
      },
      chooseEndTime:function (date) {
        this.listParams.createTimeEnd = date;
      },
      del:function () {
        this.userTip = false;
      },
      clearData:function () {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .community-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .community-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .community-list{
    padding-right: 20px;
  }
</style>
