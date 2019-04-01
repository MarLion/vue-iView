<template>
  <div class="gift-container content-pad">
    <div class="configure-fun">
      <Button type="default" icon="md-add" @click="addGift">添加礼物</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total @on-change="giftPageChange" class="mt30"/>
    </div>
    <!--新增-->
    <Modal
      v-model="showModel"
      :loading="modelLoading"
      :mask-closable="false"
      title="添加礼物"
      @on-ok="giftSub"
      @on-visible-change="isGiftVisible"
    >
      <div class="add-image">
        <p class="p">图标：</p>
        <div class="demo-upload-list" v-for="item in uploadList">
          <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload :action="uploadUrl"
                ref="giftUpload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png','bmp']"
                :on-format-error="handleFormatError"
                :before-upload="handleBeforeUpload"
                type="drag"
                style="display: inline-block;width:100px;">
          <div style="width: 100px;height:100px;line-height: 100px;">
            <Icon type="ios-camera" size="40"></Icon>
          </div>
        </Upload>
        <modal title="查看照片" v-model="visible">
          <img :src="bigUrl" style="width: 100%">
          <div slot="footer"></div>
        </modal>
      </div>
      <Form :model="giftFormData" ref="giftForm" :rules="ruleValidate" :label-width="50" class="mt20">
        <FormItem label="名称：" prop="name">
          <Input type="text" v-model="giftFormData.name"></Input>
        </FormItem>
        <FormItem label="价格：" prop="money">
          <Input type="text" v-model="giftFormData.money"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--修改-->
    <Modal
      v-model="showReviseModel"
      :loading="reviseModelLoading"
      :mask-closable="false"
      title="更新礼物"
      @on-ok="giftReviseSub"
      @on-visible-change="isGiftReviseVisible"
    >
      <div class="add-image">
        <p class="p">图标：</p>
        <div class="demo-upload-list" v-for="item in reviseUploadList">
          <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleRevView(item.url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRevRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload :action="uploadUrl"
                ref="giftReviseUpload"
                :show-upload-list="false"
                :default-file-list="dataDefault"
                :on-success="handleReviseSuccess"
                :format="['jpg','jpeg','png','bmp']"
                :on-format-error="handleFormatError"
                :before-upload="handleReviseBeforeUpload"
                multiple
                type="drag"
                style="display: inline-block;width:100px;">
          <div style="width: 100px;height:100px;line-height: 100px;">
            <Icon type="ios-camera" size="40"></Icon>
          </div>
        </Upload>
        <modal title="查看照片" v-model="reviseVisible">
          <img :src="reviseBigUrl" style="width: 100%">
          <div slot="footer"></div>
        </modal>
      </div>
      <Form :model="reviseFormData" ref="reviseFormData" :rules="ruleValidate" :label-width="50" class="mt20">
        <FormItem label="名称：" prop="name">
          <Input type="text" v-model="reviseFormData.name"></Input>
        </FormItem>
        <FormItem label="价格：" prop="money">
          <Input type="text" v-model="reviseFormData.money"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!--弹框-->
    <Modal
      title="提示"
      v-model="giftTip"
      :mask-closable = "false"
    >
      <p ref="giftTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="giftSuccess"
      :mask-closable = "false"
    >
      <p ref="addTip"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goDataList">返回列表</Button>
        <Button type="info"  @click="addDataMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写标签名称'))
    } else {
      callback();
    }
  };
  const priceValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写标签名称'))
    } else {
      callback();
    }
  };
  export default {
    name: "giftConfigure",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceOne + 'gift/saveGiftFile',
        total:'',
        loading:false,
        showModel:false,
        showReviseModel:false,
        modelLoading:true,
        reviseModelLoading:true,
        giftTip:false,
        giftSuccess:false,
        listParams:{
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
            title:'礼物编号',
            key:'id',
            align:'center'
          },
          {
            title:'礼物名称',
            key:'name',
            align:'center'
          },
          {
            title:'礼物图标',
            key:'action',
            align:'center',
            render:(h,params) => {
              return h('img',{
                attrs:{
                  src:params.row.filePath
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
            title:'礼物价格（玄乐币）',
            key:'money',
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
                      this.dataDefault.push({url:params.row.filePath,name:params.row.name,status:'finished'});
                      this.$refs.giftReviseUpload.fileList = this.dataDefault;
                      this.reviseUploadList = this.$refs.giftReviseUpload.fileList;
                      this.reviseFormData.id = params.row.id;
                      this.reviseFormData.name = params.row.name;
                      this.reviseFormData.money = params.row.money;
                      this.reviseFormData.filePath = params.row.filePath;
                      this.showReviseModel = true;
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
                      axios.GiftDelete({id:params.row.id})
                        .then(res => {
                          console.log(res);
                          this.giftTip = true;
                          this.$refs.giftTip.innerHTML = res.data;
                          if (res.code === '0') {
                            this.getGiftList();
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.giftTip = true;
                          this.$refs.giftTip.innerHTML = '操作出错！'
                        })
                    }
                  }
                },'删除')
              ])
            }
          }
        ],
        ruleValidate:{
          name:[{validator:nameValidate}],
          money:[{validator:priceValidate}]
        },
        visible:false,
        bigUrl:'',
        uploadList:[],
        giftFormData:{
          id:'',
          name:'',
          money:'',
          filePath:'',
        },
        //修改
        reviseVisible:false,
        reviseBigUrl:'',
        dataDefault:[],
        reviseUploadList:[],
        reviseFormData:{
          id:'',
          name:'',
          money:'',
          filePath:'',
        }
      }
    },
    mounted () {
      this.getGiftList();
      this.uploadList = this.$refs.giftUpload.fileList;
    },
    methods : {
      getGiftList:function () {
        this.loading = true;
        axios.GiftList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.data[0]));
            this.loading = false;
            if (res.code === 0) {
              this.listData = res.data;
              this.total = res.total;
            } else {
              this.giftTip = true;
              this.$refs.giftTip.innerHTML = '查询出错！'
            }
          })
          .catch(error => {
            console.log(error);
            this.giftTip = true;
            this.$refs.giftTip.innerHTML = '查询出错！'
          })
      },
      addGift:function () {
        this.showModel = true;
      },
      giftPageChange:function (page) {
        this.listParams.page = page;
        this.getGiftList();
      },
      //解决模态弹框开启loading之后只能阻止一次关闭 无法回到最初状态
      changeModelLoading:function () {
        this.modelLoading = false;
        this.$nextTick(() => {
          this.modelLoading = true;
        });
      },
      giftSub:function () {
        this.$refs.giftForm.validate(valid => {
          if (valid) {
            axios.GiftAdd(this.giftFormData)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.showModel = false;
                  this.giftSuccess = true;
                  this.$refs.addTip.innerHTML = res.data;
                } else {
                  this.giftTip = true;
                  this.$refs.giftTip.innerHTML = res.data;
                  this.changeModelLoading();
                }
              })
              .catch(error => {
                console.log(error);
                this.giftTip = true;
                this.$refs.giftTip.innerHTML = '添加出错！';
                this.changeModelLoading();
              })
          } else {
           this.changeModelLoading();
          }
        });
      },
      isGiftVisible:function (value) {
        if (!value) {
         this.resetForm();
        }
      },
      handleSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === '0') {
          file.url = res.data;
          this.giftFormData.filePath = res.data;
        } else {
          this.giftTip = true;
          this.$refs.giftTip.innerHTML = '图片上传出错！';
        }
      },
      handleFormatError:function () {
        this.giftTip = true;
        this.$refs.giftTip.innerHTML = '请选择格式为“jpg，jpeg，png，bmp”格式的图片！'
      },
      handleBeforeUpload:function (file) {
        const check = this.uploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Notice.warning({
            title: '图片名过长！'
          });
          return len;
        }
        if (!check) {
          this.$Notice.warning({
            title: '只能上传1张图片！'
          });
          return check;
        }
      },
      handleView:function (url) {
        this.visible = true;
        this.bigUrl = url;
      },
      handleRemove:function (file) {
        //console.log(file);
        const fileList = this.$refs.giftUpload.fileList;
        this.$refs.giftUpload.fileList.splice(fileList.indexOf(file), 1);
        this.uploadList = this.$refs.giftUpload.fileList;
      },
      resetForm:function () {
        this.$refs.giftForm.resetFields();
        this.giftFormData.filePath = '';
        this.giftFormData.id = '';
        this.$refs.giftUpload.clearFiles();
        this.uploadList = this.$refs.giftUpload.fileList;
      },
      del:function () {
        this.giftTip = false;
      },
      goDataList:function () {
        this.resetForm();
        this.giftSuccess = false;
        this.getGiftList();
      },
      addDataMore:function () {
        this.resetForm();
        this.getGiftList();
        this.giftSuccess = false;
        this.showModel = true;
      },
      //修改
      resetRevise:function () {
        this.$refs.reviseFormData.resetFields();
        this.reviseFormData.filePath = '';
        this.reviseFormData.id = '';
        this.dataDefault = [];
        this.$refs.giftReviseUpload.clearFiles();
        this.reviseUploadList = this.$refs.giftReviseUpload.fileList;
      },
      changeReviseLoading:function () {
        this.reviseModelLoading = false;
        this.$nextTick(() => {
          this.reviseModelLoading = true;
        });
      },
      giftReviseSub:function () {
        this.$refs.reviseFormData.validate(valid => {
          if (valid) {
            axios.GiftAdd(this.reviseFormData)
              .then(res => {
                //console.log(res);
                this.showReviseModel = false;
                this.giftTip = true;
                this.$refs.giftTip.innerHTML = res.data;
                if (res.code === '0') {
                  this.getGiftList();
                }
              })
              .catch(error => {
                console.log(error);
                this.giftTip = true;
                this.$refs.giftTip.innerHTML = '添加出错！';
                this.changeReviseLoading();
              })
          } else {
            this.changeReviseLoading();
          }
        });
      },
      isGiftReviseVisible:function (value) {
        if (!value) {
          this.resetRevise();
        }
      },
      handleRevView:function (url) {
        this.reviseVisible = true;
        this.reviseBigUrl = url;
      },
      handleRevRemove:function (file) {
        const fileList = this.$refs.giftReviseUpload.fileList;
        this.$refs.giftReviseUpload.fileList.splice(fileList.indexOf(file), 1);
        this.reviseUploadList = this.$refs.giftReviseUpload.fileList;
      },
      handleReviseSuccess:function (res,file,fileList) {
        if (res.code === '0') {
          file.url = res.data;
          this.reviseFormData.filePath = res.data;
        } else {
          this.giftTip = true;
          this.$refs.giftTip.innerHTML = '图片上传出错！';
        }
      },
      handleReviseBeforeUpload:function (file) {
        const check = this.reviseUploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Notice.warning({
            title: '图片名过长！'
          });
          return len;
        }
        if (!check) {
          this.$Notice.warning({
            title: '只能上传1张图片！'
          });
          return check;
        }
      }
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
