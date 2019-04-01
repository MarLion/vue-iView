<template>
  <div class="icon-container content-pad">
    <div class="configure-fun">
      <Button type="default" icon="md-add" @click="addIcon">添加图标</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading" height="600"></Table>
    </div>
    <!--新增-->
    <Modal
      v-model="showModel"
      :loading="modelLoading"
      :mask-closable="false"
      title="添加图标"
      @on-ok="iconSub"
      @on-visible-change="isIconVisible"
    >
      <upload-view ref="mesIcon" :upload-url="uploadUrl" title="图标" :length="1" :width="80" conWidth="100%" v-on:success-callback="successIconPath" v-on:remove-callback="removeIconPath"></upload-view>
      <Form :model="iconFormData" ref="iconForm" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="名称：" prop="description">
          <Input type="text" v-model="iconFormData.description"></Input>
        </FormItem>
        <FormItem label="父类型：" prop="parentType">
          <Input type="text" v-model="iconFormData.parentType"></Input>
        </FormItem>
        <FormItem label="子类型：" prop="type">
          <Input type="text" v-model="iconFormData.type"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--修改-->
    <Modal
      v-model="showReModel"
      :loading="modelReLoading"
      :mask-closable="false"
      title="修改图标"
      @on-ok="iconReSub"
      @on-visible-change="isIconReVisible"
    >
      <revise-upload-view ref="mesIconRe" :upload-url="uploadUrl" title="图标" :length="1" :width="80" conWidth="100%" :default-list="defaultIcon" :list-value="isShow" v-on:success-callback="iconReSuccess" v-on:remove-callback="iconReRemove"></revise-upload-view>
      <Form :model="iconReFormData" ref="iconReForm" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="名称：" prop="description">
          <Input type="text" v-model="iconReFormData.description"></Input>
        </FormItem>
        <FormItem label="父类型：" prop="parentType">
          <Input type="text" v-model="iconReFormData.parentType"></Input>
        </FormItem>
        <FormItem label="子类型：" prop="type">
          <Input type="text" v-model="iconReFormData.type"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="iconTip"
      :mask-closable = "false"
    >
      <p ref="iconTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="iconSuccess"
      :mask-closable = "false"
    >
      <p ref="iconSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goIconList">返回列表</Button>
        <Button type="info"  @click="addIconMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  const desValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写图标名称'))
    } else {
      callback();
    }
  };
  const parentValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写图标父类型'))
    } else {
      callback();
    }
  };
  const typeValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写图标子类型'))
    } else {
      callback();
    }
  };
  export default {
    name: "configureMessageIcon",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        total:'',
        isShow:false,
        loading:false,
        iconTip:false,
        iconSuccess:false,
        showModel:false,
        modelLoading:true,
        showReModel:false,
        modelReLoading:false,
        defaultIcon:[],
        iconFormData:{
          description:'',
          icon:'',
          parentType:'',
          type:'',
        },
        iconReFormData:{
          id:'',
          description:'',
          icon:'',
          parentType:'',
          type:'',
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'图标名称',
            key:'description',
            align:'center'
          },
          {
            title:'对应图标',
            key:'action',
            align:'center',
            render:(h,params) => {
              return h('img',{
                attrs:{
                  src:params.row.icon
                },
                style:{
                  width:'50px',
                  height:'50px',
                  borderRadius:'5px'
                }
              })
            }
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
            width:150,
            render:(h,params) => {
              return h('div',[
                h('Button',{
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on:{
                    click : () => {
                      //手动设置一下status
                      this.isShow = true;
                      this.defaultIcon.push({url:params.row.icon,name:params.row.description,status:'finished'});
                      this.iconReFormData.id = params.row.id;
                      this.iconReFormData.description = params.row.description;
                      this.iconReFormData.parentType = params.row.parentType;
                      this.iconReFormData.type = params.row.type;
                      this.showReModel = true;
                    }
                  }
                },'修改'),
                h('Button',{
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on:{
                    click : () => {
                      axios.IconDelete({id:params.row.id})
                        .then(res => {
                          //console.log(res);
                          if (res.code === '0') {
                            this.iconTip = true;
                            this.$refs.iconTip.innerHTML = '删除成功！';
                            this.getIconList();
                          } else {
                            this.iconTip = true;
                            this.$refs.iconTip.innerHTML = '删除失败！';
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.iconTip = true;
                          this.$refs.iconTip.innerHTML = '删除失败！';
                        })
                    }
                  }
                },'删除')
              ])
            }
          }
        ],
        ruleValidate:{
          description:[
            {validator:desValidate}
          ],
          parentType:[
            {validator:parentValidate}
          ],
          type:[
            {validator:typeValidate}
          ]
        },
      }
    },
    mounted () {
      this.getIconList();
    },
    methods:{
      getIconList:function () {
        this.loading = true;
        axios.IconList()
         .then(res => {
           //console.log(JSON.stringify(res.data[0]));
           this.loading = false;
           if (res.code === '0') {
             this.listData = res.data;
           } else {
             this.iconTip = true;
             this.$refs.iconTip.innerHTML = '查询出错！'
           }
         })
         .catch(error => {
           console.log(error);
           this.iconTip = true;
           this.$refs.iconTip.innerHTML = '查询出错！'
         })
      },
      addIcon:function () {
        this.showModel = true;
      },
      //新增
      successIconPath:function (file) {
        //console.log(file.url);
        this.iconFormData.icon = file.url;
      },
      removeIconPath:function () {
        this.iconFormData.icon = '';
      },
      iconSub:function () {
        this.$refs.iconForm.validate(valid => {
          if (valid) {
            axios.IconSave(this.iconFormData)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.showModel = false;
                  this.iconSuccess = true;
                  this.$refs.iconSuccess.innerHTML = '保存成功！';
                  this.getIconList();
                } else {
                  this.changeModelLoading();
                  this.iconTip = true;
                  this.$refs.iconTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.changeModelLoading();
                this.iconTip = true;
                this.$refs.iconTip.innerHTML = '保存失败！'
              })
          } else {
            this.changeModelLoading();
          }
        })
      },
      isIconVisible:function (value) {
        if (!value) {
          this.clearIconData();
        }
      },
      changeModelLoading:function () {
        this.modelLoading = false;
        this.$nextTick(() => {
          this.modelLoading = true;
        });
      },
      clearIconData:function () {
        this.$refs.mesIcon.clearUpload();
        this.$refs.iconForm.resetFields()
      },
      //修改
      iconReSuccess:function (file) {
        //console.log(file);
        this.iconReFormData.icon = file.url;
      },
      iconReRemove:function () {
        this.iconReFormData.icon = '';
      },
      iconReSub:function () {
        this.$refs.iconReForm.validate(valid => {
          if (valid) {
            axios.IconSave(this.iconReFormData)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.showModel = false;
                  this.iconTip = true;
                  this.$refs.iconTip.innerHTML = '修改成功！';
                  this.getIconList();
                } else {
                  this.changeReModelLoading();
                  this.iconTip = true;
                  this.$refs.iconTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.changeReModelLoading();
                this.iconTip = true;
                this.$refs.iconTip.innerHTML = '修改失败！'
              })
          } else {
            this.changeReModelLoading();
          }
        })
      },
      isIconReVisible:function (value) {
        if (!value) {
          this.clearIconRe();
          this.isShow = false;
        }
      },
      changeReModelLoading:function () {
        this.modelLoading = false;
        this.$nextTick(() => {
          this.modelLoading = true;
        });
      },
      clearIconRe:function () {
        this.$refs.mesIconRe.clearUpload();
        this.$refs.iconReForm.resetFields();
        this.iconReFormData.id = '';
        this.defaultIcon = [];
      },
      del:function () {
        this.iconTip = false;
      },
      goIconList:function () {
        this.clearIconData();
        this.iconSuccess = false;
      },
      addIconMore:function () {
        this.clearIconData();
        this.iconSuccess = false;
        this.showModel = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .configure-fun{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .community-list{
    padding-right: 20px;
  }
  .add-image{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 550px;
  }
  .p{
    width: 50px;
    height: 90px;
    line-height: 90px;
    text-align: left;
    padding: 10px 0;
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
