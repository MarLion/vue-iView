<template>
  <div class="banner-container content-pad">
    <div class="configure-fun">
      <div class="community-search">
        <span class="ml15">图片状态：</span>
        <span>
            <Select v-model="listParams.showHidden" @on-change="getHealthBannerList" style="width:200px">
              <Option v-for="item in statusList" :value="item.id" :key="item.name">{{item.name}}</Option>
            </Select>
          </span>
      </div>
      <Button type="default" icon="md-add" @click="addHealthBanner" class="ml30">添加Banner</Button>
    </div>
    <div class="community-list mt30">
      <Table border :columns="columns" :data="listData" :loading="loading" height="600"></Table>
      <!--<Page :total="total" v-if="total>10" show-elevator show-total @on-change="bannerPageChange" class="mt30"/>-->
    </div>
    <Modal title="查看大图" v-model="tabBig">
      <img :src="tabUrl" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
    <!--添加banner-->
    <Modal
      v-model="isAddKnowBanner"
      :loading="knowBannerLoading"
      :mask-closable="false"
      title="添加Banner"
      @on-ok="knowBannerSub"
      @on-visible-change="isKnowBannerVisible"
    >
      <Form :model="knowBannerFormData" ref="knowBannerForm" :rules="ruleValidate" >
        <FormItem>
          <upload-view ref="knowBannerCover" :upload-url="uploadUrl" title="上传图片" :length="1" :width="80" con-width="100%" v-on:success-callback="successKnowBannerPath" v-on:remove-callback="removeKnowBannerPath"></upload-view>
        </FormItem>
        <FormItem label="图片名称：" :label-width="80" prop="name">
          <Input type="text" v-model="knowBannerFormData.name"></Input>
        </FormItem>
        <FormItem label="关联文章：" :label-width="80">
          <AutoComplete
            v-model="knowBannerFormData.articleName"
            icon="ios-search"
            placeholder="输入知识标题查询"
            :disabled="isForbidden"
            @on-search="searchKnowArticle(knowBannerFormData.articleName)"
          >
            <Option v-for="item in articleList" :value="item.title" :key="item.id">
              <div class="demo-auto-complete-item" @click="getKnowArtId($event,item.id)">{{item.title}}</div>
            </Option>
          </AutoComplete>
        </FormItem>
        <FormItem label="是否推荐：" :label-width="80">
          <Checkbox v-model="knowBannerFormData.recommend" true-value='1' false-value='0' class="ml15"></Checkbox>
        </FormItem>
      </Form>
    </Modal>
    <!--修改-->
    <Modal
      v-model="isReKnowBanner"
      :loading="knowBannerReLoading"
      :mask-closable="false"
      title="添加Banner"
      @on-ok="knowBannerReSub"
      @on-visible-change="isKnowBannerReVisible"
    >
      <Form :model="knowBannerReFormDate" ref="knowBannerReForm" :rules="ruleValidate" >
        <FormItem>
          <revise-upload-view ref="knowBannerRe" :upload-url="uploadUrl" title="上传图片" :length="1" :width="80" con-width="100%" :default-list="defaultReBanner" :list-value="isRe" v-on:success-callback="bannerReSuccess" v-on:remove-callback="bannerReRemove"></revise-upload-view>
        </FormItem>
        <FormItem label="图片名称：" :label-width="80" prop="name">
          <Input type="text" v-model="knowBannerReFormDate.name"></Input>
        </FormItem>
        <FormItem label="关联文章：" :label-width="80">
          <AutoComplete
            v-model="knowBannerReFormDate.articleName"
            icon="ios-search"
            placeholder="输入知识标题查询"
            :disabled="isReForbidden"
            @on-search="searchKnowReArticle(knowBannerReFormDate.articleName)"
          >
            <Option v-for="item in articleReList" :value="item.title" :key="item.id">
              <div class="demo-auto-complete-item" @click="getKnowReArtId($event,item.id)">{{item.title}}</div>
            </Option>
          </AutoComplete>
        </FormItem>
        <FormItem label="是否推荐：" :label-width="80">
          <Checkbox v-model="knowBannerReFormDate.recommend" true-value='1' false-value='0' class="ml15"></Checkbox>
        </FormItem>
      </Form>
    </Modal>
    <!--提示弹框-->
    <Modal
      title="提示"
      v-model="healthBannerTip"
      :mask-closable = "false"
    >
      <p ref="healthBannerTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <Modal
      title="提示"
      v-model="healthBannerSuccess"
      :mask-closable = "false"
    >
      <p ref="healthBannerSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="warning"  @click="goList">返回列表</Button>
        <Button type="info"  @click="addMore">继续添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  const nameValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写图片名称'));
    } else {
      callback();
    }
  };
  const artValidate = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写关联文章名称查询'));
    } else {
      callback();
    }
  };
  export default {
    name: "configureHealthBanner",
    data () {
      return {
        uploadUrl:base.baseUrl.serviceTwo + 'documents/saveFiles',
        loading:false,
        healthBannerTip:false,
        healthBannerSuccess:false,
        tabBig:false,
        tabUrl:'',
        statusList:[
          {
            id:2,
            name:'不限'
          },
          {
            id:0,
            name:'展示'
          },
          {
            id:1,
            name:'隐藏'
          }
        ],
        listParams:{
          showHidden:''
        },
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
            title:'关联项',
            key:'articleName',
            align:'center'
          },
          {
            title:'是否推荐',
            key:'recommendText',
            align:'center',
          },
          {
            title:'是否展示',
            key:'showHiddenText',
            align:'center',
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
                    this.isReKnowBanner = true;
                    this.isRe = true;
                    this.defaultReBanner.push({url:params.row.picture,name:params.row.name,status:'finished'});
                    this.knowBannerReFormDate.articleId = params.row.articleId;
                    this.knowBannerReFormDate.articleName = params.row.articleName;
                    this.knowBannerReFormDate.name = params.row.name;
                    this.knowBannerReFormDate.picture = params.row.picture;
                    this.knowBannerReFormDate.recommend = params.row.recommend.toString();
                    this.knowBannerReFormDate.id = params.row.id;
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
                    axios.HealthBannerRecommend({recommend:1,id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.healthBannerTip = true;
                        this.$refs.healthBannerTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getHealthBannerList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.healthBannerTip = true;
                        this.$refs.healthBannerTip.innerHTML = '操作失败！';
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
                    axios.HealthBannerRecommend({recommend:0,id:params.row.id})
                      .then(res => {
                        //console.log(res);
                        this.healthBannerTip = true;
                        this.$refs.healthBannerTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getHealthBannerList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.healthBannerTip = true;
                        this.$refs.healthBannerTip.innerHTML = '操作失败！';
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
                    axios.HealthBannerShowOrHide({id:params.row.id,showHidden:0})
                      .then(res => {
                        //console.log(res);
                        this.healthBannerTip = true;
                        this.$refs.healthBannerTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getHealthBannerList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.healthBannerTip = true;
                        this.$refs.healthBannerTip.innerHTML = '操作失败！';
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
                    axios.HealthBannerShowOrHide({id:params.row.id,showHidden:1})
                      .then(res => {
                        //console.log(res);
                        this.healthBannerTip = true;
                        this.$refs.healthBannerTip.innerHTML = res.data;
                        if (res.code === '0') {
                          this.getHealthBannerList();
                        }
                      })
                      .catch(error => {
                        console.log(error);
                        this.healthBannerTip = true;
                        this.$refs.healthBannerTip.innerHTML = '操作失败！';
                      })
                  }
                }
              },'隐藏');
              if (params.row.recommend === 0 && params.row.showHidden === 0) {
                return h('div',[
                  recommend,
                  revise,
                  hidden,
                ])
              }  else if (params.row.recommend === 0 && params.row.showHidden === 1) {
                return h('div',[
                  recommend,
                  revise,
                  show,
                ])
              } else if (params.row.recommend === 1 && params.row.showHidden === 0) {
                return h('div',[
                  noRecommend,
                  revise,
                  hidden,
                ])
              } else if (params.row.recommend === 1 && params.row.showHidden === 1) {
                return h('div',[
                  noRecommend,
                  revise,
                  show,
                ])
              }
            }
          }
        ],
        //新增
        isForbidden:false,
        isAddKnowBanner:false,
        knowBannerLoading:true,
        knowBannerFormData:{
          articleId:'',
          articleName:'',
          name:'',
          picture:'',
          recommend:'1'
        },
        articleList:[],
        //修改
        articleReList:[],
        isReForbidden:false,
        isReKnowBanner:false,
        knowBannerReLoading:true,
        isRe:false,
        defaultReBanner:[],
        knowBannerReFormDate:{
          id:'',
          articleId:'',
          articleName:'',
          name:'',
          picture:'',
          recommend:''
        },
        ruleValidate:{
          name:[
            {validator:nameValidate}
          ],
          articleName:[
            {validator:artValidate}
          ]
        }
      }
    },
    mounted () {
      this.getHealthBannerList();
    },
    methods:{
      getHealthBannerList:function () {
        this.loading = true;
        axios.HealthBannerList(this.listParams)
          .then(res => {
            //console.log(JSON.stringify(res.data.list[0]));
            if (res.code === '0') {
              this.loading = false;
              this.listData = res.data.list;
            } else {
              this.healthBannerTip = true;
              this.$refs.healthBannerTip.innerHTML = '查询出错！';
            }
          })
          .catch(error => {
            console.log(error);
            this.healthBannerTip = true;
            this.$refs.healthBannerTip.innerHTML = '查询出错！';
          })
      },
      addHealthBanner:function () {
        this.isAddKnowBanner = true;
      },
      del:function () {
        this.healthBannerTip = false;
      },
      goList:function () {
        this.resetBanner();
        this.healthBannerSuccess = false;
      },
      addMore:function () {
        this.resetBanner();
        this.healthBannerSuccess = false;
        this.isAddKnowBanner = true;
      },
      //新增
      successKnowBannerPath:function (file,title,fileList) {
        this.knowBannerFormData.picture = file.url;
      },
      removeKnowBannerPath:function () {
        this.knowBannerFormData.picture = '';
      },
      searchKnowArticle:function (name) {
        axios.HealthBannerGetKnow({name:name})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.articleList = res.data;
            }
          })
          .catch(error => {
            console.log(error);
            this.$Notice.warning({
              title: '知识文章查询失败！'
            });
          })
      },
      getKnowArtId:function (e,id) {
        this.knowBannerFormData.articleId = id;
      },
      knowBannerSub:function () {
        this.$refs.knowBannerForm.validate(valid => {
          if (valid) {
            //console.log(this.knowBannerFormData);
            axios.HealthBannerAdd(this.knowBannerFormData)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.isAddKnowBanner = false;
                  this.healthBannerSuccess = true;
                  this.$refs.healthBannerSuccess.innerHTML = res.data;
                  this.getHealthBannerList();
                } else {
                  this.$Message.error(res.data);
                  this.changKnowModal();
                }
              })
              .catch(error => {
                console.log(error);
                this.$Message.error('保存出错！');
                this.changKnowModal();
              })
          } else {
            this.changKnowModal();
          }
        })
      },
      isKnowBannerVisible:function (value) {
        if (!value) {
          this.resetBanner();
        }
      },
      changKnowModal:function () {
        this.knowBannerLoading = false;
        this.$nextTick(() => {
          this.knowBannerLoading = true;
        });
      },
      resetBanner:function () {
        this.$refs.knowBannerCover.clearUpload();
        this.$refs.knowBannerForm.resetFields();
        this.knowBannerFormData.articleId = '';
        this.knowBannerFormData.articleName = '';
        this.knowBannerFormData.picture = '';
        this.knowBannerFormData.recommend = '1';
      },
      //修改
      isKnowBannerReVisible:function (value) {
        if (!value) {
          this.resetReBanner();
        }
      },
      changKnowReModal:function () {
        this.knowBannerReLoading = false;
        this.$nextTick(() => {
          this.knowBannerReLoading = true;
        });
      },
      bannerReSuccess:function (file,title,fileList) {
        this.knowBannerReFormDate.picture = file.url;
      },
      bannerReRemove:function (file) {
        this.knowBannerReFormDate.picture = '';
      },
      searchKnowReArticle:function (name) {
        axios.HealthBannerGetKnow({name:name})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              this.articleReList = res.data;
            }
          })
          .catch(error => {
            console.log(error);
            this.$Notice.warning({
              title: '知识文章查询失败！'
            });
          })
      },
      getKnowReArtId:function (e,id) {
        this.knowBannerReFormDate.articleId = id;
      },
      knowBannerReSub:function () {
        this.$refs.knowBannerReForm.validate(valid => {
          if (valid) {
            axios.HealthBannerAdd(this.knowBannerReFormDate)
              .then(res => {
                //console.log(res);
                if (res.code === '0') {
                  this.isReKnowBanner = false;
                  this.healthBannerTip = true;
                  this.$refs.healthBannerTip.innerHTML = res.data;
                  this.getHealthBannerList();
                } else {
                  this.$Message.error(res.data);
                  this.changKnowReModal();
                }
              })
              .catch(error => {
                console.log(error);
                this.$Message.error('修改出错！');
                this.changKnowReModal();
              })
          } else {
            this.changKnowReModal();
          }
        })
      },
      resetReBanner:function () {
        this.isRe = false;
        this.defaultReBanner = [];
        this.$refs.knowBannerRe.clearUpload();
        this.$refs.knowBannerReForm.resetFields();
        this.knowBannerReFormDate.articleId = '';
        this.knowBannerReFormDate.articleName = '';
        this.knowBannerReFormDate.picture = '';
        this.knowBannerReFormDate.recommend = '1';
        this.knowBannerReFormDate.id = '';
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
</style>
