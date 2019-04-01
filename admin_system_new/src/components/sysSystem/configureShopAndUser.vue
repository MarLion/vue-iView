<template>
  <div class="out-container content-pad">
    <div class="route-fun">
      <div class="route-ope">
        <!--<Button type="default" icon="ios-cloud-upload" @click="importData">批量导入</Button>-->
        <Button type="default" icon="ios-download" @click="exportData">导出EXCEL</Button>
      </div>
      <div class="route-search">
        <span class="ml15">员工名称：</span>
        <span><Input class="middle-checkWid" v-model="listParams.name"/></span>
        <span class="ml15">员工电话：</span>
        <span><Input class="middle-checkWid" v-model="listParams.mobile"/></span>
        <span class="ml10"><Button icon="ios-search" @click="checkClick">查询</Button></span>
      </div>
    </div>
    <div class="user-container mt20">
      <div class="tree-container">
        <Tree :data="treeData" :load-data="loadData" @on-select-change="clickNode"></Tree>
      </div>
      <div class="message-container">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="userPageChange" class="mt30"/>
      </div>
    </div>
    <Drawer
      title="新增员工"
      v-model="userValue"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close="clearUserData"
    >

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
    <Modal
      title="提示"
      v-model="userSuccess"
      :mask-closable = "false"
    >
      <p ref="userSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goUserList">返回列表</Button>
        <Button type="info"  @click="addUserMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "configureShopAndUser",
    data () {
      return {
        loading:false,
        total:'',
        userTip: false,
        userSuccess: false,
        userValue:false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        listParams: {
          pageNum: 1,
          pageSize: 10,
          deptId: '',
          name: '',
          mobile:''
        },
        apartParams: {
          parentId: '',
        },
        treeData: [],
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'姓名',
            key:'userName',
            align:'center'
          },
          {
            title:'性别',
            key:'sex',
            align:'center'
          },
          {
            title:'所属部门',
            key:'deptName',
            align:'center'
          },
          {
            title:'职位',
            key:'post',
            align:'center'
          },
          {
            title:'电话',
            key:'mobile',
            align:'center'
          },
          {
            title:'玄乐账号',
            key:'xlLoginName',
            align:'center'
          },
          {
            title:'操作选项',
            align:'center',
            width:230,
            render:(h,params) => {
              const del = h('Button',{
                props:{
                  type: 'error',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.SysUserDelete({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.userTip = true;
                        this.$refs.userTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getUserList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.userTip = true;
                        this.$refs.userTip.innerHTML = '删除失败！';
                      })
                  }
                }
              },'删除');
              const pass = h('Button',{
                props:{
                  type: 'warning',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.SysUserPassword({id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.userTip = true;
                        this.$refs.userTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getUserList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.userTip = true;
                        this.$refs.userTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'密码初始化');
              return h('div',[
                del,
                pass
              ])
            }
          }
        ],
      }
    },
    mounted () {
      this.getApartment();
      this.getUserList();
    },
    methods: {
      getApartment: function () {
        axios.SysUserApartment(this.apartParams)
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.treeData = res.result;
            } else {
              this.userTip = true;
              this.$refs.userTip.innerHTML = '获取部门失败！';
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      loadData(item, callback) {
        //console.log(item);
          if (item.hasChild === 1) {
            this.apartParams.parentId = item.id;
            axios.SysUserApartment(this.apartParams)
              .then(res => {
                //console.log(res);
                if (res.code === 200) {
                  callback(res.result);
                } else {
                  this.userTip = true;
                  this.$refs.userTip.innerHTML = '获取部门失败！';
                }
              })
              .catch(error => {
                console.log(error);
                this.userTip = true;
                this.$refs.userTip.innerHTML = '获取部门失败！';
              });
          } else {
              item.loading = false;
          }
      },
      getUserList:function () {
        this.loading = true;
        axios.SysUserList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify( res.data.list[0]));
            if (res.code === '0') {
              this.loading = false;
              this.listData = res.data.list;
              this.total = res.data.total;
            } else {
              this.userTip = true;
              this.$refs.userTip.innerHTML = '获取用户信息失败！';
            }
          })
          .catch(error => {
            console.log(error);
            this.userTip = true;
            this.$refs.userTip.innerHTML = '获取用户信息失败！';
          })
      },
      addUser: function () {
        this.userValue = true;
      },
      importData:function () {

      },
      exportData: function () {
        window.location.href = base.baseUrl.serviceFour + 'employee/exportExcel';
      },
      checkClick: function () {
        this.listParams.pageNum = 1;
        this.getUserList();
      },
      userPageChange:function (page) {
        this.listParams.pageNum = page;
        this.getUserList();
      },
      del: function () {
        this.userTip = false;
      },
      clickNode:function (data) {
        //console.log(data);
        if (data.length > 0) {
          this.listParams.deptId = data[0].id;
          this.listParams.pageNum = 1;
          this.getUserList();
        }
      },
      goUserList: function () {

      },
      addUserMore: function () {

      },
      clearUserData:function () {

      },


    }
  }
</script>

<style lang="scss" scoped>
  .route-fun{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .route-search{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      line-height: 33px;
      padding-right: 30px;
    }
  }
  .route-list{
    padding-right: 20px;
  }
  .user-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .tree-container{
      width: 12%;
      border: 1px solid #DCDEE2;
      padding: 5px;
      border-radius: 5px;
      max-height: 700px;
      overflow-y: scroll;
    }
    .tree-container::-webkit-scrollbar{
      width: 5px;
    }
    .tree-container::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: #A2DCF8;
    }
    .tree-container::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 10px;
      background: #EDEDED;
    }
    .message-container{
      width: 87%;
      padding-right: 30px;
    }
  }
  .ivu-tree {
    text-align: left;
  }
</style>
