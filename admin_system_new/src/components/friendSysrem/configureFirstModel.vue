<template>
  <div class="first-container content-pad">
    <div class="configure-fun">
      <Button type="default" icon="md-add" @click="addModel">添加模块</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading"></Table>
      <Page :total="total" v-if="total>10" show-elevator show-total @on-change="modelPageChange" class="mt30"/>
    </div>
    <Modal title="查看大图" v-model="tabBig">
      <img :src="tabUrl" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
    <!--添加-->
    <Drawer
      title="添加模块"
      v-model="modelValue"
      width="750"
      :mask-closable="false"
      :styles="styles"
      @on-close="resetFirForm"
    >
      <Form :model="firFormData" ref="firForm" :rules="ruleValidate" :label-width="100">
        <FormItem label="模块名称：" prop="name">
          <Input type="text" v-model="firFormData.name"></Input>
        </FormItem>
        <FormItem label="所属模块：">
          <div class="configure-container">
            <RadioGroup v-model="firFormData.parentId" vertical>
              <Radio v-for="item in existModal" :key="item.id" :label="item.id" class="ml30" :disabled="item.hasArticle">
                <Icon type="ios-arrow-down"></Icon>{{item.name}}
                <Radio v-for="it in item.levelDtoList" :key="it.id" :label="it.id" class="ml15" disabled>
                  {{it.name}}
                </Radio>
              </Radio>
            </RadioGroup>
            <!--<dl v-for="item in existModal" :key="item.id">-->
              <!--<dt>-->
                <!--<Checkbox><Icon type="ios-arrow-down"></Icon>{{item.name}}</Checkbox>-->
              <!--</dt>-->
              <!--<dd v-for="it in item.levelDtoList" :key="it.id" class="mt10">-->
                <!--<Checkbox>{{it.name}}</Checkbox>-->
              <!--</dd>-->
            <!--</dl>-->
          </div>
        </FormItem>
        <FormItem label="模块封面：">
          <div class="add-image">
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
                    ref="firUpload"
                    :show-upload-list="false"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png','bmp']"
                    :on-format-error="handleFormatError"
                    :before-upload="handleBeforeUpload"
                    multiple
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
        </FormItem>
        <FormItem style="width: 200px!important;">
          <Button type="primary" @click="firClick" :loading="dataLoading">确认添加</Button>
        </FormItem>
      </Form>
    </Drawer>
    <!--修改-->
    <Drawer
      title="修改模块"
      v-model="reModelValue"
      width="750"
      :mask-closable="false"
      :styles="styles"
      @on-close="resetReFirForm"
    >
      <Form :model="firReFormData" ref="firReForm" :rules="ruleValidate" :label-width="100">
        <FormItem label="模块名称：" prop="name">
          <Input type="text" v-model="firReFormData.name"></Input>
        </FormItem>
        <FormItem label="所属模块：">
          <div class="configure-container">
            <RadioGroup v-model="firReFormData.parentId" vertical>
              <Radio v-for="item in existModal" :key="item.id" :label="item.id" class="ml30">
                <Icon type="ios-arrow-down"></Icon>{{item.name}}
                <Radio v-for="it in item.levelDtoList" :key="it.id" :label="it.id" class="ml15">
                  {{it.name}}
                </Radio>
              </Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem label="模块封面：">
          <div class="add-image">
            <div class="demo-upload-list" v-for="item in reUploadList">
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleReView(item.url)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleReRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload :action="uploadUrl"
                    ref="secReUpload"
                    :show-upload-list="false"
                    :default-file-list="dataDefault"
                    :on-success="handleReSuccess"
                    :format="['jpg','jpeg','png','bmp']"
                    :on-format-error="handleFormatError"
                    :before-upload="handleReBeforeUpload"
                    multiple
                    type="drag"
                    style="display: inline-block;width:100px;">
              <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
            <modal title="查看照片" v-model="reVisible">
              <img :src="reBigUrl" style="width: 100%">
              <div slot="footer"></div>
            </modal>
          </div>
        </FormItem>
        <FormItem style="width: 200px!important;">
          <Button type="primary" @click="firReviseClick" :loading="dataReviseLoading">确认修改</Button>
        </FormItem>
      </Form>
    </Drawer>
    <Modal
      title="提示"
      v-model="modalTip"
      :mask-closable = "false"
    >
      <p ref="modalTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="modalSuccess"
      :mask-closable = "false"
    >
      <p ref="modalSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goList">返回列表</Button>
        <Button type="info"  @click="addMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "@/axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "configureFirstModel",
    data () {
      const nameValidate = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写名称'))
        } else {
          callback();
        }
      };
      return {
        uploadUrl:base.baseUrl.serviceOne + 'gift/saveGiftFile',
        total:'',
        loading:false,
        modelValue:false,
        reModelValue:false,
        dataLoading:false,
        dataReviseLoading:false,
        modalTip:false,
        modalSuccess:false,
        tabBig:false,
        tabUrl:'',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        listParams:{
          page:1,
          size:10
        },
        //已有层级数组
        existModal:[],
        //新增数据
        visible:false,
        uploadList:[],
        bigUrl:'',
        firFormData:{
          name:'',
          parentId:'',
          backPic:''
        },
        //修改数据
        dataDefault:[],
        reVisible:false,
        reUploadList:[],
        reBigUrl:'',
        firReFormData:{
          id:'',
          name:'',
          parentId:'',
          backPic:''
        },
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'模块名称',
            key:'name',
            align:'center'
          },
          {
            title:'所属模块',
            key:'modelName',
            align:'center'
          },
          {
            title:'模块封面',
            key:'path',
            align:'center',
            render:(h,params) => {
              return h('img',{
                attrs:{
                  src:params.row.back_pic
                },
                style:{
                  height:'50px',
                  borderRadius:'5px',
                  cursor:'pointer'
                },
                on:{
                  click:() => {
                    this.tabBig = true;
                    this.tabUrl = params.row.back_pic;
                  }
                }
              })
            }
          },
          {
            title:'是否展示',
            key:'',
            align:'center',
            render:(h,params) => {
              if (params.row.status === 1) {
                return h('div',{
                  style:{
                    height:'100%',
                  }
                },'展示中')
              } else {
                return h('div',{
                  style:{
                    height:'100%',
                  }
                },'隐藏')
              }
            }
          },
          {
            title:'是否推荐',
            key:'',
            align:'center',
            render:(h,params) => {
              if (params.row.recomment === 0) {
                return h('div',{
                  style:{
                    height:'100%',
                  }
                },'未推荐')
              } else {
                return h('div',{
                  style:{
                    height:'100%',
                  }
                },'已推荐')
              }
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
            width:200,
            render:(h,params) => {
              const recom = h('Button',{
                  props:{
                    type: 'success',
                    size: 'small'
                  },
                  style:{
                    marginRight:'5px'
                  },
                  on:{
                    click:() => {
                      axios.ModalRecommend({id:params.row.id,recomment:1})
                        .then(res => {
                          //console.log(res);
                          if (res.code === '0') {
                            this.modalTip = true;
                            this.$refs.modalTip.innerHTML = res.data;
                            this.getModalList();
                          } else {
                            this.modalTip = true;
                            this.$refs.modalTip.innerHTML = res.message;
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.modalTip = true;
                          this.$refs.modalTip.innerHTML = '操作失败！'
                        })
                    }
                  }
                },'设为推荐');
              const noRecom = h('Button',{
                  props:{
                    type: 'error',
                    size: 'small'
                  },
                  style:{
                    marginRight:'5px'
                  },
                  on:{
                    click:() => {
                      axios.ModalRecommend({id:params.row.id,recomment:0})
                        .then(res => {
                          if (res.code === '0') {
                            this.modalTip = true;
                            this.$refs.modalTip.innerHTML = res.data;
                            this.getModalList();
                          } else {
                            this.modalTip = true;
                            this.$refs.modalTip.innerHTML = res.message;
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.modalTip = true;
                          this.$refs.modalTip.innerHTML = '操作失败！'
                        })
                    }
                  }
                },'取消推荐');
              const revise =  h('Button',{
                  props:{
                    type: 'info',
                    size: 'small'
                  },
                  style:{
                    marginRight:'5px'
                  },
                  on:{
                    click:() => {
                      this.reModelValue = true;
                      this.getExistModal('');
                      this.firReFormData.id = params.row.id;
                      this.firReFormData.name = params.row.name;
                      this.firReFormData.parentId = params.row.parent_id;
                      if (params.row.back_pic !== '' && params.row.back_pic != null) {
                        this.dataDefault.push({url:params.row.back_pic,name:params.row.name,status:'finished'});
                        this.$refs.secReUpload.fileList = this.dataDefault;
                        this.reUploadList = this.$refs.secReUpload.fileList;
                      }
                    }
                  }
                },'修改');
              const show =  h('Button',{
                props:{
                  type: 'success',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    axios.ModalDelete({id:params.row.id,status:1})
                      .then(res => {
                        //console.log(res);
                        if (res.code === '0') {
                          this.getModalList();
                          this.modalTip = true;
                          this.$refs.modalTip.innerHTML = res.data;
                        } else {
                          this.modalTip = true;
                          this.$refs.modalTip.innerHTML = res.message;
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.modalTip = true;
                        this.$refs.modalTip.innerHTML = '操作失败！'
                      })
                  }
                }
              },'展示');
              const hidden = h('Button',{
                  props:{
                    type: 'error',
                    size: 'small'
                  },
                  style:{
                    marginRight:'5px'
                  },
                  on:{
                    click:() => {
                      axios.ModalDelete({id:params.row.id,status:0})
                        .then(res => {
                          //console.log(res);
                          if (res.code === '0') {
                            this.getModalList();
                            this.modalTip = true;
                            this.$refs.modalTip.innerHTML = res.data;
                          } else {
                            this.modalTip = true;
                            this.$refs.modalTip.innerHTML = res.message;
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.modalTip = true;
                          this.$refs.modalTip.innerHTML = '操作失败！'
                        })
                    }
                  }
                },'隐藏');
              if (params.row.status === 0 && params.row.recomment === 0) {
                return h('div',[
                  recom,
                  revise,
                  show,
                ])
              }  else if (params.row.status === 0 && params.row.recomment === 1) {
                return h('div',[
                  noRecom,
                  revise,
                  show,
                ])
              } else if (params.row.status === 1 && params.row.recomment === 0) {
                return h('div',[
                  recom,
                  revise,
                  hidden,
                ])
              } else if (params.row.status === 1 && params.row.recomment === 1) {
                return h('div',[
                  noRecom,
                  revise,
                  hidden,
                ])
              }
            }
          }
        ],
        ruleValidate:{
          name:[
            {validator:nameValidate}
          ]
        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.firUpload.fileList;
      this.getModalList();
    },
    methods : {
      getModalList:function(){
        axios.ModalList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.data[0]));
            if (res.code === 0) {
              this.listData = res.data;
              this.total = res.total;
            } else {
              this.modalTip = true;
              this.$refs.modalTip.innerHTML = '查询出错！'
            }
          })
          .catch(error => {
            console.log(error);
            this.modalTip = true;
            this.$refs.modalTip.innerHTML = '查询出错！'
          })
      },
      getExistModal:function (id) {
        axios.ModalExist({type:1,id:id})
          .then(res => {
            console.log(res);
            if (res.code === '0') {
              this.existModal = res.data;
            } else {
              this.$Notice.warning({
                title: '获取模块失败！'
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.$Notice.warning({
              title: '获取模块失败！'
            });
          })
      },
      addModel:function () {
        this.modelValue = true;
        this.getExistModal('');
      },
      modelPageChange:function (page) {
        //console.log(page);
        this.listParams.page = page;
        this.getModalList();
      },
      //图片相关
      handleView:function (url) {
        this.bigUrl = url;
        this.visible = true;
      },
      handleRemove:function (file) {
        const fileList = this.$refs.firUpload.fileList;
        this.$refs.firUpload.fileList.splice(fileList.indexOf(file), 1);
        this.uploadList = this.$refs.firUpload.fileList;
        this.firFormData.backPic = '';
      },
      handleSuccess:function (res,file,fileList) {
        if (res.code === '0') {
          file.url = res.data;
          this.firFormData.backPic = res.data;
        } else {
          this.modalTip = true;
          this.$refs.modalTip.innerHTML = '图片上传出错！'
        }
      },
      handleFormatError:function () {
        this.$Message.error('请选择格式为“jpg，jpeg，png，bmp”格式的图片！');
      },
      handleBeforeUpload:function (file) {
        const check = this.uploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.error('图片名过长！');
          return len;
        }
        if (!check) {
          this.$Message.error('只能上传1张图片！');
          return check;
        }
      },
      firClick:function () {
        this.$refs.firForm.validate(valid => {
          if (valid) {
            //console.log(this.firFormData);
            this.dataLoading = true;
            axios.ModalAdd(this.firFormData)
              .then(res => {
                //console.log(res);
                this.dataLoading = false;
                if (res.code === '0') {
                  this.getModalList();
                  this.modalSuccess = true;
                  this.$refs.modalSuccess.innerHTML = res.data;
                } else {
                  this.modalTip = true;
                  this.$refs.modalTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.dataLoading = false;
                this.modalTip = true;
                this.$refs.modalTip.innerHTML = '新增出错！'
              })
          }
        })
      },
      //修改图片
      handleReView:function (url) {
        this.reVisible = true;
        this.reBigUrl = url;
      },
      handleReRemove:function (file) {
        const fileList = this.$refs.secReUpload.fileList;
        this.$refs.secReUpload.fileList.splice(fileList.indexOf(file), 1);
        this.reUploadList = this.$refs.secReUpload.fileList;
        this.firReFormData.backPic = '';
      },
      handleReSuccess:function (res,file,fileList) {
        if (res.code === '0') {
          file.url = res.data;
          this.firReFormData.backPic = res.data;
        } else {
          this.modalTip = true;
          this.$refs.modalTip.innerHTML = '图片修改出错！'
        }
      },
      handleReBeforeUpload:function (file) {
        const check = this.reUploadList.length < 1;
        const len = file.name.length <= 50;
        if (!len) {
          this.$Message.error('图片名过长！');
          return len;
        }
        if (!check) {
          this.$Message.error('只能上传1张图片！');
          return check;
        }
      },
      firReviseClick:function () {
        this.$refs.firReForm.validate(valid => {
          if (valid) {
            this.dataLoading = true;
            axios.ModalAdd(this.firReFormData).
              then(res => {
                console.log(res);
              this.dataLoading = false;
                if (res.code === '0') {
                  this.resetReFirForm();
                  this.reModelValue = false;
                  this.modalTip = true;
                  this.$refs.modalTip.innerHTML = res.data;
                  this.getModalList();
                } else {
                  this.modalTip = true;
                  this.$refs.modalTip.innerHTML = res.message;
                }
            })
              .catch(error => {
                console.log(error);
                this.dataLoading = false;
                this.modalTip = true;
                this.$refs.modalTip.innerHTML = '修改失败！'
              })
          }
        })
      },
     //重置表单
      resetFirForm:function () {
        this.getExistModal('');
        this.$refs.firForm.resetFields();
        this.firFormData.parentId = '';
        this.firFormData.backPic = '';
        this.$refs.firUpload.clearFiles();
        this.uploadList = this.$refs.firUpload.fileList;
      },
      resetReFirForm:function () {
        this.getExistModal('');
        this.$refs.firReForm.resetFields();
        this.firReFormData.id = '';
        this.firReFormData.parentId = '';
        this.firReFormData.backPic = '';
        this.dataDefault = [];
        this.$refs.secReUpload.clearFiles();
        this.reUploadList = this.$refs.secReUpload.fileList;
      },
      del:function () {
        this.modalTip = false;
      },
      goList:function () {
        this.resetFirForm();
        this.modelValue = false;
        this.modalSuccess = false;
      },
      addMore:function () {
        this.resetFirForm();
        this.modalSuccess = false;
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
  .configure-container .ivu-radio-group{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    //padding:  0 30px;
    //height: 550px;
    //border: 1px solid #cccccc;
    //overflow-y: scroll;
    dl{
      margin-left: 30px;
      dd{
        text-align: left;
        padding-left: 15px;
      }
    }
  }
  .ivu-radio-group-vertical .ivu-radio-wrapper{
    height: auto;
  }
  .article{
    //text-align: left;
    text-indent: 2em;
    img{
      text-align:center
    }
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
