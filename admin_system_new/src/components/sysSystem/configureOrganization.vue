<template>
  <div class="out-container content-pad">
    <div class="route-fun">
      <div class="route-ope">
        <Button type="default" icon="md-add" @click="addPost">新增职务</Button>
        <Button type="default" icon="md-add" @click="deletePost">删除职务</Button>
        <!--<Button type="default" icon="ios-cloud-upload" @click="addPostBatch">批量导入</Button>-->
        <!--<Button type="default" icon="ios-cloud-download" @click="downPostModal">下载模板</Button>-->
      </div>
      <div class="route-search">
        <span class="ml15">员工名称：</span>
        <span><Input class="middle-checkWid" v-model="listParams.userName"/></span>
        <span class="ml10"><Button icon="ios-search" @click="postClick">查询</Button></span>
      </div>
    </div>
    <div class="user-container mt20">
      <div class="tree-container">
        <Tree :data="treeData" :load-data="loadData" @on-select-change="clickPostNode"></Tree>
      </div>
      <div class="message-container">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" :current="listParams.page" v-if="total>10" show-elevator show-total @on-change="postPageChange" class="mt30"/>
      </div>
    </div>
    <!--批量导入-->
    <Modal
      v-model="batchPost"
      :mask-closable="false"
      title="批量导入"
      @on-visible-change="isBatchVisible"
    >
      <div class="add-image">
        <p class="p">导入Excel：</p>
        <Upload :action="uploadUrl"
                ref="batchUpload"
                :show-upload-list="true"
                :on-success="handleSuccess"
                :format="['xls','xlsx']"
                :on-format-error="handleFormatError"
                :before-upload="handleBeforeUpload"
                type="drag"
                style="display: inline-block;width:100px;">
          <div style="width: 100px;height:100px;line-height: 100px;">
            <Icon type="ios-add" size="40"></Icon>
          </div>
        </Upload>
      </div>
      <div slot="footer">
        <Button type="info"  @click="sure">确定</Button>
      </div>
    </Modal>
    <!--新增职务-->
    <Modal
      title="新增职务"
      v-model="postValue"
      :loading="addPostLoading"
      :mask-closable = "false"
      @on-ok="postSub"
      @on-visible-change="isPostVisible"
    >
      <Form :model="postData" ref="postForm" :rules="ruleValidate" style="width: 100%;">
        <FormItem label="上级职务：" prop="parentName" :label-width="80">
          <Input type="text" disabled  v-model="postData.parentName" ></Input>
        </FormItem>
        <FormItem label="职务名称：" prop="name" :label-width="80">
          <Input type="text" :disabled="disableValue"  v-model="postData.name" ></Input>
        </FormItem>
        <FormItem label="所在部门：" prop="deptId" :label-width="80" v-if="showDept">
          <Select v-model="postData.deptId">
            <Option v-for="item in deptList" :key="item.id" :value="item.id">
              {{item.name}}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!--关联职务-->
    <Modal
      title="管理员工"
      v-model="relateValue"
      :loading="relateLoading"
      :mask-closable = "false"
      @on-ok="relateSub"
      @on-visible-change="isRelateVisible"
    >
      <Form :model="relateData" ref="relateData" style="width: 100%;">
        <FormItem label="关联员工：" prop="userName" :label-width="80">
          <AutoComplete
            v-model="relateData.userName"
            icon="ios-search"
            placeholder="输入员工姓名查询"
            @on-search="searchUser(relateData.userName)"
          >
            <Option v-for="item in nameList" :value="item.user_name" :key="item.id">
              <div class="demo-auto-complete-item" @click="getUserId(item.id)">{{item.user_name}}</div>
            </Option>
          </AutoComplete>
        </FormItem>
      </Form>
    </Modal>
    <!--提示弹框-->
    <Modal
      title="提示"
      v-model="postTip"
      :mask-closable = "false"
    >
      <p ref="postTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  const deptValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请选择部门'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureOrganization",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceFour + 'postLevel/importExcel',
        total:'',
        loading:false,
        postTip:false,
        postValue:false,
        addPostLoading:true,
        batchPost:false,
        treeParams:{
          parentId:''
        },
        listParams:{
          id:'',
          userName:'',
          page:1,
          rows:10
        },
        treeData:[],
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'职位',
            key:'levelName',
            align:'center'
          },
          {
            title:'部门',
            key:'deptName',
            align:'center'
          },
          {
            title:'姓名',
            key:'userName',
            align:'center'
          },
          {
            title:'所属上级',
            key:'parentName',
            align:'center'
          },
          {
            title:'玄乐账号',
            key:'loginName',
            align:'center'
          },
          {
            title:'操作选项',
            align:'center',
            width:115,
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
                    axios.SysPostCancel({levelId:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.postTip = true;
                        this.$refs.postTip.innerHTML = res.message;
                        if (res.code === 200) {
                          this.getPostUser();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.postTip = true;
                        this.$refs.postTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'解除职务');
              const add = h('Button',{
                props:{
                  type: 'info',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    this.relateValue = true;
                    this.relateData.levelId = params.row.id;
                  }
                }
              },'关联职务');
              if (params.row.hasUser === 0) {
                return h('div',[
                  add
                ])
              } else {
                return h('div',[
                  del
                ])
              }
            }
          }
        ],
        disableValue:true,
        postData:{
          name:'',
          parentName:'',
          parentId:'',
          deptId:''
        },
        //关联职务数据
        relateValue:false,
        relateLoading:true,
        relateData:{
          levelId:'',
          userName:'',
          userId:''
        },
        nameList:[],
        deptList:[],
        showDept:false,
        ruleValidate:{
          deptId:[
            {validator:deptValidate}
          ]
        },
      }
    },
    mounted () {
      this.getPostNode();
      this.getPostUser();
    },
    methods:{
      getPostNode:function () {
        axios.SysPostTree(this.treeParams)
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.treeData = res.result;
            } else {
              this.postTip = true;
              this.$refs.postTip.innerHTML = '获取职务节点失败！';
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      getPostUser:function () {
        this.loading = true;
        axios.SysPostUser(this.listParams)
          .then(res => {
            //console.log(JSON.stringify( res.result.list[0]));
            if (res.code === 200) {
              this.loading = false;
              this.listData = res.result.list;
              this.total = res.result.total;
            } else {
              this.postTip = true;
              this.$refs.postTip.innerHTML = '获取用户信息失败！';
            }
          })
          .catch(error => {
            console.log(error);
            this.postTip = true;
            this.$refs.postTip.innerHTML = '获取用户信息失败！';
          })
      },
      loadData (item, callback) {
        if (item.hasChild === 1) {
          this.treeParams.parentId = item.id;
          axios.SysPostTree(this.treeParams)
            .then(res => {
              //console.log(res);
              if (res.code === 200) {
                callback(res.result);
              } else {
                this.postTip = true;
                this.$refs.postTip.innerHTML = '获取职务失败！';
              }
            })
            .catch(error => {
              console.log(error);
              this.postTip = true;
              this.$refs.postTip.innerHTML = '获取职务失败！';
            });
        } else {
          item.loading = false;
          this.$Message.warning('没有下级职务！');
        }
      },
      clickPostNode:function (data) {
        //console.log(data);
        if (data.length > 0) {
          this.listParams.id = data[0].id;
          this.listParams.page = 1;
          this.getPostUser();
          this.postData.parentName = data[0].title;
          this.postData.parentId = data[0].id;
        } else {
          this.resetPost();
        }
      },
      addPostBatch:function () {
        this.batchPost = true;
      },
      isBatchVisible:function (value) {
        if (!value) {
          this.$refs.batchUpload.clearFiles();
        }
      },
      downPostModal:function () {
        window.location.href = base.baseUrl.serviceFour + 'postLevel/getImportExcel';
      },
      postClick:function () {
        this.listParams.page = 1;
        this.getPostUser();
      },
      postPageChange:function (page) {
        this.listParams.page = page;
        this.getPostUser();
      },
      addPost:function () {
        if (this.postData.parentId === '') {
          this.$Message.warning('请选择上级职务！');
        } else {
          this.postValue = true;
          axios.SysPostLower({name:this.postData.parentName})
            .then(res => {
              //console.log(res);
              if (res.code === 200) {
                this.postData.name = res.result.name;
                this.disableValue = res.result.name !== '';
                if (res.result.isHasDept === 1) {
                  this.getAddShop();
                  this.showDept = true;
                }
              } else {
                this.$Message.error('职务名称查询失败！');
              }
            })
            .catch(error => {
              console.log(error);
              this.$Message.error('职务名称查询失败！');
            });

        }
      },
      getAddShop:function () {
        axios.SysPostGetShop({levelId:this.postData.parentId})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.deptList = res.result;
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error('部门信息查询失败！');
          })
      },
      deletePost:function () {
        if (this.postData.parentId === '') {
          this.$Message.warning('请选择要删除的职务！');
        } else {
          axios.SysPostDelete({id:this.postData.parentId})
            .then(res => {
              //console.log(res);
              if (res.code === 200) {
                this.$Message.success(res.message);
                this.treeParams.parentId = '';
                this.getPostNode();
                this.resetPost();
              } else {
                this.$Message.error(res.message);
              }
            })
            .catch(error => {
              console.log(error);
              this.$Message.error('删除失败！');
            })
        }
      },
      del:function () {
        this.postTip = false;
      },
      postSub:function () {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            axios.SysPostSave(this.postData)
              .then(res => {
                console.log(res);
                if (res.code === 200) {
                  this.resetPost();
                  this.postValue = false;
                  this.postTip = true;
                  this.$refs.postTip.innerHTML = res.message;
                  this.treeParams.parentId = '';
                  this.getPostNode();
                } else {
                  this.$Message.error(res.message);
                  this.changeModelLoading();
                }
              })
              .catch(error => {
                console.log(error);
                this.$Message.error('保存失败！');
                this.changeModelLoading();
              })
          }  else {
            this.changeModelLoading();
          }
        });
      },
      isPostVisible:function (value) {
        if (!value) {
          this.deptList = [];
          this.showDept = false;
        }
      },
      changeModelLoading:function () {
        this.addPostLoading = false;
        this.$nextTick(() => {
          this.addPostLoading = true;
        });
      },
      resetPost:function () {
        this.$refs.postForm.resetFields();
        this.postData.parentId = '';
      },
      relateSub:function () {
        axios.SysPostRelation(this.relateData)
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.relateValue = false;
              this.postTip = true;
              this.$refs.postTip.innerHTML = res.message;
              this.getPostUser();
            } else {
              this.$Message.error(res.message);
              this.changeRelateLoading();
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error('保存失败！');
            this.changeRelateLoading();
          })
      },
      isRelateVisible:function (value) {
        if (!value) {
          this.resetRelate();
        }
      },
      searchUser:function (name) {
        axios.SysPostUserByChoosed({levelId:this.relateData.levelId,userName:name})
          .then(res => {
            //console.log(res);
            if (res.code === 200) {
              this.nameList = res.result;
            } else {
              this.$Message.error('查询出错！');
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error('查询出错！');
          })
      },
      getUserId:function (id) {
        this.relateData.userId = id;
        //console.log(this.relateData.userId);
      },
      resetRelate:function () {
        this.$refs.relateData.resetFields();
        this.relateData.userId = '';
        this.relateData.levelId = '';
        this.nameList = [];
      },
      changeRelateLoading:function () {
        this.relateLoading = false;
        this.$nextTick(() => {
          this.relateLoading = true;
        });
      },
      sure:function () {
        this.batchPost = false;
        this.$refs.batchUpload.clearFiles();
      },
      handleSuccess:function (res,file,fileList) {
        console.log(res);
        if (res.code === 200) {
          this.$Message.success(res.message);
          this.listParams.page = 1;
          this.getPostUser();
        } else {
          this.$Message.error(res.message);
        }
      },
      handleFormatError:function () {
        this.$Message.error('请选择Excel文件上传！');
      },
      handleBeforeUpload:function (file) {
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.error('文件名过长！');
        }
        return len;
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
      height: 5px;
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
  .add-image{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .p{
    width: 80px;
    height: 90px;
    line-height: 90px;
    text-align: left;
    padding: 10px 0;
  }
</style>
