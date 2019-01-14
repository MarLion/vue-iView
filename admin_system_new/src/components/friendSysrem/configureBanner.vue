<template>
    <div class="banner-container content-pad">
      <div class="configure-fun">
        <div class="community-search">
          <span class="ml15">图片状态：</span>
          <span>
            <Select v-model="listParams.status" @on-change="getBannerList" style="width:200px">
              <Option v-for="item in statusList" :value="item.id" :key="item.name">{{item.name}}</Option>
            </Select>
          </span>
        </div>
        <Button type="default" icon="md-add" @click="addBanner" class="ml30">添加Banner</Button>
      </div>
      <div class="community-list mt30">
        <Table border :columns="columns" :data="listData" :loading="loading"></Table>
        <Page :total="total" v-if="total>10" show-elevator show-total @on-change="bannerPageChange" class="mt30"/>
      </div>
      <Modal title="查看大图" v-model="tabBig">
        <img :src="tabUrl" style="width: 100%">
        <div slot="footer"></div>
      </Modal>
      <!--新增-->
      <Modal
        v-model="isAddBanner"
        :loading="bannerLoading"
        :mask-closable="false"
        title="添加Banner"
        @on-ok="bannerSub"
        @on-visible-change="isBannerVisible"
      >
        <div class="add-image">
          <p class="p">上传图片：</p>
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
                  ref="bannerUpload"
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
          <modal title="查看图片" v-model="visible">
            <img :src="bigUrl" style="width: 100%">
            <div slot="footer"></div>
          </modal>
        </div>
        <Form :model="bannerFormData" ref="bannerForm" :rules="ruleValidate" :label-width="80" class="mt20">
          <FormItem label="图片名称：" prop="name">
            <Input type="text" v-model="bannerFormData.name"></Input>
          </FormItem>
          <FormItem label="关联文章：" prop="contentName">
            <AutoComplete
              v-model="bannerFormData.contentName"
              icon="ios-search"
              placeholder="输入文章名查询"
              :disabled="isForbidden"
              @on-search="searchArticle(bannerFormData.contentName)"
            >
              <Option v-for="item in articleList" :value="item.name" :key="item.id">
                <div class="demo-auto-complete-item" @click="getArtId($event,item.id)">{{item.name}}</div>
              </Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="是否推荐：">
            <Checkbox v-model="bannerFormData.showType" true-value='1' false-value='0' class="ml15"></Checkbox>
          </FormItem>
        </Form>
      </Modal>
      <!--修改-->
      <Modal
        v-model="isReBanner"
        :loading="bannerReLoading"
        :mask-closable="false"
        title="修改Banner"
        @on-ok="bannerReSub"
        @on-visible-change="isBannerReVisible"
      >
        <div class="add-image">
          <p class="p">上传图片：</p>
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
                  ref="bannerReUpload"
                  :show-upload-list="false"
                  :default-file-list="dataDefault"
                  :on-success="handleReSuccess"
                  :format="['jpg','jpeg','png','bmp']"
                  :on-format-error="handleFormatError"
                  :before-upload="handleReBeforeUpload"
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
        <Form :model="bannerReFormData" ref="bannerReForm" :rules="ruleValidate" :label-width="80" class="mt20">
          <FormItem label="图片名称：">
            <Input type="text" v-model="bannerReFormData.name"></Input>
          </FormItem>
          <FormItem label="关联文章：" prop="contentName">
            <AutoComplete
              v-model="bannerReFormData.contentName"
              icon="ios-search"
              placeholder="输入文章名查询"
              :disabled="isReForbidden"
              @on-search="searchReArticle(bannerReFormData.contentName)"
            >
              <Option v-for="item in articleReList" :value="item.name" :key="item.id">
                <div class="demo-auto-complete-item" @click="getReArtId($event,item.id)">{{item.name}}</div>
              </Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="是否推荐：">
            <Checkbox v-model="bannerReFormData.showType" true-value='1' false-value='0' class="ml15"></Checkbox>
          </FormItem>
        </Form>
      </Modal>
      <Modal
        title="提示"
        v-model="bannerTip"
        :mask-closable = "false"
      >
        <p ref="bannerTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
      </Modal>
      <Modal
        title="提示"
        v-model="bannerSuccess"
        :mask-closable = "false"
      >
        <p ref="bannerSuccess"></p>
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
    name: "configureBanner",
    data () {
      const artValidate = (rule,value,callback) => {
        if (value === '') {
          callback(new Error('请填写文章名称'))
        } else {
          callback();
        }
      };
      return {
        //这里用礼物配置的图片上传地址
        uploadUrl:base.baseUrl.serviceOne + 'gift/saveGiftFile',
        total:'',
        loading:false,
        isAddBanner:false,
        bannerLoading:true,
        isReBanner:false,
        bannerReLoading:true,
        tabBig:false,
        bannerTip:false,
        bannerSuccess:false,
        tabUrl:'',
        listParams:{
          status:2,
          page:1,
          size:10
        },
        statusList:[
          {
            name:'全部',
            id:2
          },
          {
            name:'展示中',
            id:1
          },
          {
            name:'隐藏中',
            id:0
          }
        ],
        //添加Banner数据
        isForbidden:false,
        articleList:[],
        uploadList:[],
        visible:false,
        bigUrl:'',
        bannerFormData:{
          contentId:'',
          contentName:'',
          picture:'',
          name:'',
          showType:'0'
        },
        //修改Banner数据
        isReForbidden:false,
        articleReList:[],
        dataDefault:[],
        reUploadList:[],
        reVisible:false,
        reBigUrl:'',
        bannerReFormData:{
          id:'',
          contentId:'',
          contentName:'',
          picture:'',
          name:'',
          showType:'0'
        },
        //列表数据
        listData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title:'图片',
            key:'image',
            align:'center',
            render:(h,params) => {
              return h('img',{
                attrs:{
                  src:params.row.picture
                },
                style:{
                  height:'50px',
                  borderRadius:'5px',
                  cursor:'pointer'
                },
                on:{
                  click:() => {
                    this.tabBig = true;
                    this.tabUrl = params.row.picture;
                  }
                }
              })
            }
          },
          {
            title:'关联文章',
            key:'contentName',
            align:'center'
          },
          {
            title:'是否推荐',
            key:'',
            align:'center',
            render:(h,params) => {
              if (params.row.showType === 0) {
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
              const revise =   h('Button',{
                props:{
                  type: 'info',
                  size: 'small'
                },
                style:{
                  marginRight:'5px'
                },
                on:{
                  click:() => {
                    this.isReBanner = true;
                    this.reClick(params.row.id,params.row.contentName,params.row.contentId,params.row.picture,params.row.name,params.row.showType.toString());
                  }
                }
              },'修改');
              const recommend = h('Button',{
                  props:{
                    type: 'success',
                    size: 'small'
                  },
                  style:{
                    marginRight:'5px'
                  },
                  on:{
                    click:() => {
                      axios.BannerRecommend({marriageChartId:params.row.id,showType:1})
                        .then(res => {
                          console.log(res);
                          if (res.code === '0') {
                            this.bannerTip = true;
                            this.$refs.bannerTip.innerHTML = res.data;
                            this.getBannerList();
                          } else {
                            this.bannerTip = true;
                            this.$refs.bannerTip.innerHTML = '操作出错！'
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.bannerTip = true;
                          this.$refs.bannerTip.innerHTML = '操作出错！'
                        })
                    }
                  }
                },'设置推荐');
              const noRecommend = h('Button',{
                  props:{
                    type: 'error',
                    size: 'small'
                  },
                  style:{
                    marginRight:'5px'
                  },
                  on:{
                    click:() => {
                      axios.BannerRecommend({marriageChartId:params.row.id,showType:0})
                        .then(res => {
                          //console.log(res);
                          if (res.code === '0') {
                            this.bannerTip = true;
                            this.$refs.bannerTip.innerHTML = res.data;
                            this.getBannerList();
                          } else {
                            this.bannerTip = true;
                            this.$refs.bannerTip.innerHTML = '操作出错！'
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.bannerTip = true;
                          this.$refs.bannerTip.innerHTML = '操作出错！'
                        })
                    }
                  }
                },'取消推荐');
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
                      axios.BannerIsShow({marriageChartId:params.row.id,status:1})
                        .then(res => {
                          //console.log(res);
                          if (res.code === '0') {
                            this.bannerTip = true;
                            this.$refs.bannerTip.innerHTML = res.data;
                            this.getBannerList();
                          } else {
                            this.bannerTip = true;
                            this.$refs.bannerTip.innerHTML = '操作出错！'
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.bannerTip = true;
                          this.$refs.bannerTip.innerHTML = '操作出错！'
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
                      axios.BannerIsShow({marriageChartId:params.row.id,status:0})
                        .then(res => {
                          //console.log(res);
                          if (res.code === '0') {
                            this.bannerTip = true;
                            this.$refs.bannerTip.innerHTML = res.data;
                            this.getBannerList();
                          } else {
                            this.bannerTip = true;
                            this.$refs.bannerTip.innerHTML = '操作出错！'
                          }
                        })
                        .catch(error => {
                          console.log(error);
                          this.bannerTip = true;
                          this.$refs.bannerTip.innerHTML = '操作出错！'
                        })
                    }
                  }
                },'隐藏');
              if (params.row.status === 0 && params.row.showType === 0) {
                return h('div',[
                  recommend,
                  revise,
                  show,
                ])
              }  else if (params.row.status === 0 && params.row.showType === 1) {
                return h('div',[
                  noRecommend,
                  revise,
                  show,
                ])
              } else if (params.row.status === 1 && params.row.showType === 0) {
                return h('div',[
                  recommend,
                  revise,
                  hidden,
                ])
              } else if (params.row.status === 1 && params.row.showType === 1) {
                return h('div',[
                  noRecommend,
                  revise,
                  hidden,
                ])
              }
            }
          }
        ],
        ruleValidate:{
          contentName:[{validator:artValidate}]
        }
      }
    },
    mounted () {
      this.getBannerList();
      this.uploadList = this.$refs.bannerUpload.fileList;
    },
    methods:{
      getBannerList:function () {
        this.loading = true;
        axios.BannerList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.data[0]));
            if (res.code === 0) {
              this.loading = false;
              this.listData = res.data;
              this.total = res.total;
            } else {
              this.bannerTip = true;
              this.$refs.bannerTip.innerHTML = '查询出错！'
            }
          })
          .catch(error => {
            console.log(error);
            this.bannerTip = true;
            this.$refs.bannerTip.innerHTML = '查询出错！'
          })
      },
      addBanner:function () {
        this.isAddBanner = true;
      },
      bannerPageChange:function (page) {
        this.listParams.page = page;
        this.getBannerList();
      },
      //查询文章
      searchArticle:function (name) {
        axios.BannerArticleCheck({name:name})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.articleList = res.data;
            }
          })
          .catch(error => {
            console.log(error);
            this.$Notice.warning({
              title: '文章查询失败！'
            });
          })
      },
      getArtId:function (e,id) {
        //console.log(id);
        this.bannerFormData.contentId = id;
      },
      //新增
      bannerSub:function () {
        this.$refs.bannerForm.validate(valid => {
          if (valid) {
            axios.BannerSaveAndRevise(this.bannerFormData)
              .then(res => {
                console.log(res);
                if (res.code === '0') {
                  this.isAddBanner = false;
                  this.bannerSuccess = true;
                  this.$refs.bannerSuccess.innerHTML = res.data;
                  this.getBannerList();
                } else {
                  this.$Message.error(res.message);
                  this.changModal();
                }
              })
              .catch(error => {
                console.log(error);
                this.$Message.error('添加出错！');
                this.changModal();
              })
          } else {
            this.changModal();
          }
        });
      },
      isBannerVisible:function (value) {
        if (!value) {
          this.resetForm();
        }
      },
      //新增上传图片
      handleSuccess:function (res,file,fileList) {
        //console.log(res);
        if (res.code === '0') {
          file.url = res.data;
          this.bannerFormData.picture = res.data;
        } else {
          this.$Message.error('图片上传出错！');
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
      handleView:function (url) {
        this.visible = true;
        this.bigUrl = url;
      },
      handleRemove:function (file) {
        const fileList = this.$refs.bannerUpload.fileList;
        this.$refs.bannerUpload.fileList.splice(fileList.indexOf(file), 1);
        this.uploadList = this.$refs.bannerUpload.fileList;
        this.bannerFormData.picture = '';
      },
      //修改
      reClick:function (id,contentName,contentId,picture,name,showType) {
        //console.log(showType);
        this.dataDefault.push({url:picture,name:name,status:'finished'});
        this.$refs.bannerReUpload.fileList = this.dataDefault;
        this.reUploadList = this.$refs.bannerReUpload.fileList;
        this.bannerReFormData.id = id;
        this.bannerReFormData.contentName = contentName;
        this.bannerReFormData.contentId = contentId;
        this.bannerReFormData.picture = picture;
        this.bannerReFormData.name = name;
        this.bannerReFormData.showType = showType;
        //console.log(this.bannerReFormData.contentId);
      },
      searchReArticle:function(name){
        //this.bannerReFormData.contentId = '';
        //console.log(this.bannerReFormData.contentId);
        axios.BannerArticleCheck({name:name})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.articleReList = res.data;
            }
          })
          .catch(error => {
            console.log(error);
            this.$Notice.warning({
              title: '文章查询失败！'
            });
          })
      },
      getReArtId:function (e,id) {
        this.bannerReFormData.contentId = id;
        //console.log(id);
      },
      bannerReSub:function () {
        this.$refs.bannerReForm.validate(valid => {
          if (valid) {
            axios.BannerSaveAndRevise(this.bannerReFormData)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.isReBanner = false;
                  this.$Message.success('修改成功！');
                  this.getBannerList();
                } else {
                  this.$Message.error(res.message);
                  this.changReModal();
                }
              })
              .catch(error => {
                console.log(error);
                this.$Message.error('修改出错！');
                this.changReModal();
              })
          } else {
            this.changReModal();
          }
        });
      },
      isBannerReVisible:function (value) {
        if (!value) {
          this.resetReForm();
        }
      },
      handleReView:function (url) {
        this.reVisible = true;
        this.reBigUrl = url;
      },
      handleReRemove:function (file) {
        const fileList = this.$refs.bannerReUpload.fileList;
        this.$refs.bannerReUpload.fileList.splice(fileList.indexOf(file), 1);
        this.reUploadList = this.$refs.bannerReUpload.fileList;
        this.bannerReFormData.picture = '';
      },
      handleReSuccess:function (res,file,fileList) {
        if (res.code === '0') {
          file.url = res.data;
          this.bannerReFormData.picture = res.data;
        } else {
          this.$Message.error('图片上传出错！');
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
      del:function () {
        this.bannerTip = false;
      },
      goList:function () {
        this.resetForm();
        this.bannerSuccess = false;
      },
      addMore:function () {
        this.resetForm();
        this.bannerSuccess = false;
        this.isAddBanner = true;
      },
      //重置表单
      resetForm:function () {
        this.$refs.bannerForm.resetFields();
        this.bannerFormData.picture = '';
        this.bannerFormData.contentId = '';
        this.bannerFormData.showType = '0';
        this.$refs.bannerUpload.clearFiles();
        this.uploadList = this.$refs.bannerUpload.fileList;
      },
      resetReForm:function () {
        this.$refs.bannerReForm.resetFields();
        this.bannerReFormData.picture = '';
        this.bannerReFormData.contentId = '';
        this.bannerReFormData.id = '';
        this.bannerReFormData.showType = '0';
        this.dataDefault = [];
        this.$refs.bannerReUpload.clearFiles();
        this.reUploadList = this.$refs.bannerReUpload.fileList;
      },
      changModal:function () {
        this.bannerLoading = false;
        this.$nextTick(() => {
          this.bannerLoading = true;
        });
      },
      changReModal:function () {
        this.bannerReLoading = false;
        this.$nextTick(() => {
          this.bannerReLoading = true;
        });
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
    width: 80px;
    height: 90px;
    line-height: 90px;
    text-align: right;
    padding: 10px 12px 10px 0;
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
  .demo-auto-complete-item{
    cursor: pointer;
    padding: 4px 6px;
    border-bottom: 1px solid #F6F6F6;
  }
  .demo-auto-complete-item:hover{
    background-color: #F7F1F1;
  }
</style>
